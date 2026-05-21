import * as qz from 'qz-tray'

export const initQzTray = async () => {
  qz.security.setCertificatePromise((resolve, reject) => {
    fetch(`${process.env.REACT_APP_API_URL}/config/get-certificate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }}
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Certificate request failed: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (!data?.certificate) {
          throw new Error('No certificate returned from server')
        }
        const certificate = data.certificate.trim()
        resolve(certificate)
      })
      .catch((err) => {
        console.error('Error signing data for QZ Tray:', err)
        reject(err)
      })
  })

  qz.security.setSignatureAlgorithm("SHA512")

  qz.security.setSignaturePromise((toSign) => {
    return (resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_URL}/config/sign-qz-cert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: toSign
        })
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Signature request failed: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          if (!data?.signature) {
            throw new Error('No signature returned from server')
          }
          const signature = data.signature.trim()
          resolve(signature)
        })
        .catch((err) => {
          console.error('Error signing data for QZ Tray:', err)
          reject(err)
        })
    }
  })

  if (!qz.websocket.isActive()) {
    await qz.websocket.connect()
  }
}

export const handleThermalPrint = async (data: { items: { description: string; qty: number, options: { name: string, value: string }[] }[], createdAt: string, invoice: string }, printer: string="Gprinter GP-2270T") => {
    try {
      // 1. Find your printer by its Windows name
      const config = qz.configs.create(printer);

      // 2. For each item, print as many labels as the quantity
      for (const item of data.items || []) {
        // sanitize description to avoid breaking TSPL string quoting
        const desc = (item.description || '').toString().replace(/"/g, "'");
        for (let i = 0; i < (item.qty || 0); i++) {
          const optionsText = item.options?.slice(0, 3).map((option, index) => `
            TEXT 70,${110 + index * 30},"2",0,1,1,"- ${option.name}: ${option.value}"\r\n
            `)
          const tsplData = [
            'SIZE 52 mm, 126 mm\r\n',
            'GAP 2 mm, 0 mm\r\n',
            'DENSITY 1\r\n',
            'CLS\r\n',
            // use built-in font index (e.g. "3") instead of external TTF file
            // invoice/timestamp below item description
            `TEXT 50,20,"2",0,1,1,"${(data.createdAt || '')}"\r\n`,
            `TEXT 50,50,"2",0,1,1,"Queue: #${(data.invoice?.split('-')[1] || '')}"\r\n`,
            `TEXT 50,80,"2",0,1,1,"${desc}"\r\n`,
            ...(optionsText || []),
            // move barcode lower so it doesn't overlap text and reduce its height
            'PRINT 1,1\r\n',
          ];

          // send each label to the printer sequentially
          await qz.print(config, tsplData);
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

export type ReceiptTransaction = {
  item?: string;
  qty?: number;
  disc?: string;
  price?: string;
  total?: string;
};

export type ReceiptData = {
  name?: string;
  invoice?: string;
  cashier?: string;
  createdAt?: string;
  transactions?: ReceiptTransaction[];
  subtotal?: string;
  discount?: string;
  tax?: string;
  total?: string;
  address?: string;
  footer?: string;
};

export const handleReceiptPrint = async (data: ReceiptData, printer: string = "POS80 Printer", charsPerLine: number = 48) => {
    try {
      const config = qz.configs.create(printer);
      if (config.setEncoding) {
        config.setEncoding('UTF-8');
      }

      const sanitize = (value: string = '') => value.toString().replace(/"/g, "'")
      const getColumnWidths = (lineWidth: number) => {
        const qtyWidth = 4;
        const minPrice = 8;
        const minDisc = 8;
        const minTotal = 8;
        const minItem = 12;

        let priceWidth = Math.max(minPrice, Math.floor(lineWidth * 0.18));
        let discWidth = Math.max(minDisc, Math.floor(lineWidth * 0.18));
        let totalWidth = Math.max(minTotal, Math.floor(lineWidth * 0.18));
        let itemWidth = lineWidth - qtyWidth - priceWidth - discWidth - totalWidth;

        if (itemWidth < minItem) {
          priceWidth = minPrice;
          discWidth = minDisc;
          totalWidth = minTotal;
          itemWidth = lineWidth - qtyWidth - priceWidth - discWidth - totalWidth;
        }

        if (itemWidth < minItem) {
          itemWidth = Math.max(8, itemWidth);
          const extra = minItem - itemWidth;
          const reduceFrom = [priceWidth - minPrice, discWidth - minDisc, totalWidth - minTotal].reduce((sum, v) => sum + Math.max(0, v), 0);
          if (reduceFrom > 0) {
            const ratio = extra / reduceFrom;
            priceWidth = Math.max(minPrice, priceWidth - Math.round((priceWidth - minPrice) * ratio));
            discWidth = Math.max(minDisc, discWidth - Math.round((discWidth - minDisc) * ratio));
            totalWidth = Math.max(minTotal, totalWidth - Math.round((totalWidth - minTotal) * ratio));
            itemWidth = lineWidth - qtyWidth - priceWidth - discWidth - totalWidth;
          }
        }

        if (itemWidth < 1) {
          itemWidth = 1;
          priceWidth = Math.max(minPrice, lineWidth - qtyWidth - discWidth - totalWidth - itemWidth);
        }

        return { itemWidth, qtyWidth, priceWidth, discWidth, totalWidth };
      }

      const { itemWidth, qtyWidth, priceWidth, discWidth, totalWidth } = getColumnWidths(charsPerLine);
      const lineSep = '-'.repeat(charsPerLine);
      const pad = (text: string, width: number, align: 'left' | 'right' = 'left') => {
        const safe = text.length > width ? text.slice(0, width - 1) + '…' : text;
        return align === 'right'
          ? ' '.repeat(Math.max(0, width - safe.length)) + safe
          : safe + ' '.repeat(Math.max(0, width - safe.length));
      }

      const wrapText = (text: string, width: number) => {
        const words = text.split(' ');
        const lines: string[] = [];
        let line = '';

        for (const word of words) {
          const next = line ? `${line} ${word}` : word;
          if (next.length <= width) {
            line = next;
          } else {
            if (line) lines.push(line);
            line = word;
          }
        }

        if (line) lines.push(line);
        return lines.length ? lines : [''];
      }

      const init = '\x1B@'
      const alignCenter = '\x1Ba\x01'
      const alignLeft = '\x1Ba\x00'
      const boldOn = '\x1BE\x01'
      const boldOff = '\x1BE\x00'
      const doubleSize = '\x1D!\x11'
      const normalSize = '\x1D!\x00'
      const cut = '\x1DV\x00'
      const drawerPulse = '\x1Bp\x00\x3C\xFF'
      const newLine = '\n'

      const headerParts = [
        init,
        alignCenter,
        boldOn,
        doubleSize,
        `${sanitize(data.name || '')}`,
        newLine,
        `#${sanitize(data.invoice?.split('-')[1] || '')}`,
        boldOff,
        normalSize,
        newLine,
      ];

      const addressParts = data.address
        ? [alignCenter, `${sanitize(data.address)}`, newLine]
        : [];

      const transactionLines = [
        alignLeft,
        lineSep,
        newLine,
        `Invoice: ${sanitize(data.invoice || '')}`,
        newLine,
        `Cashier: ${sanitize(data.cashier || '')}`,
        newLine,
        `Date: ${sanitize(data.createdAt || '')}`,
        newLine,
        lineSep,
        newLine,
        pad('Item', itemWidth),
        pad('Qty', qtyWidth, 'right'),
        pad('Price', priceWidth, 'right'),
        pad('Disc', discWidth, 'right'),
        pad('Total', totalWidth, 'right'),
        newLine,
        lineSep,
        newLine,
        ...(data.transactions || []).flatMap((item) => {
          const itemName = sanitize(item.item || '');
          const wrappedName = wrapText(itemName, itemWidth);
          const qtyText = (item.qty || 0).toString();
          const priceText = sanitize(item.price || '');
          const totalText = sanitize(item.total || '');
          const discText = sanitize(item.disc || '');

          const rows: string[] = [];
          rows.push(
            pad(wrappedName[0], itemWidth),
            pad(qtyText, qtyWidth, 'right'),
            pad(priceText, priceWidth, 'right'),
            pad(discText, discWidth, 'right'),
            pad(totalText, totalWidth, 'right'),
            newLine,
          );

          for (let i = 1; i < wrappedName.length; i += 1) {
            rows.push(
              pad(wrappedName[i], itemWidth),
              pad('', qtyWidth, 'right'),
              pad('', priceWidth, 'right'),
              pad('', discWidth, 'right'),
              pad('', totalWidth, 'right'),
              newLine,
            );
          }

          return rows;
        }),
        lineSep,
        newLine,
      ];

      const shouldShowTotalLine = (value?: string) => {
        if (!value) return false;
        const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
        return !Number.isNaN(numeric) && numeric !== 0;
      }

      const totalLines = ['Subtotal', 'Discount', 'Tax', 'Total'].flatMap((label) => {
        const value = data[label.toLowerCase() as keyof ReceiptData] as string | undefined;
        if (!shouldShowTotalLine(value)) return [];

        const labelWidth = Math.max(12, charsPerLine - 20);
        const valueWidth = charsPerLine - labelWidth;
        return [
          pad(`${label}:`, labelWidth),
          pad(sanitize(value || ''), valueWidth, 'right'),
          newLine,
        ];
      });

      const footerParts = data.footer
        ? [newLine, newLine, alignCenter, `${sanitize(data.footer)}`, newLine, newLine]
        : [newLine, newLine];

      const receipt = [
        ...headerParts,
        ...addressParts,
        ...transactionLines,
        ...totalLines,
        ...footerParts,
        drawerPulse,
        newLine.repeat(3),
        cut,
      ].join('');

      await qz.print(config, [receipt]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };