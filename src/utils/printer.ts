import * as qz from 'qz-tray'

export const handleThermalPrint = async (data: { items: { description: string; qty: number, options: { name: string, value: string }[] }[], createdAt: string, invoice: string }, printer: string="Gprinter GP-2270T") => {
    try {
      // 1. Find your printer by its Windows name
      const config = qz.configs.create(printer);

      // 2. For each item, print as many labels as the quantity
      for (const item of data.items || []) {
        // sanitize description to avoid breaking TSPL string quoting
        const desc = (item.description || '').toString().replace(/"/g, "'");
        for (let i = 0; i < (item.qty || 0); i++) {
          const optionsText = item.options?.map((option, index) => `
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
            `TEXT 50,50,"2",0,1,1,"#${(data.invoice || '')}"\r\n`,
            `TEXT 50,80,"2",0,1,1,"${desc}"\r\n`,
            ...(optionsText || []),
            // move barcode lower so it doesn't overlap text and reduce its height
            'PRINT 1,1\r\n',
          ];

          // send each label to the printer sequentially
          await qz.print(config, tsplData);
        }
      }

      console.log("Labels printed instantly!");
    } catch (error) {
      console.error("Printing failed:", error);
    }
  };

export type ReceiptTransaction = {
  item?: string;
  qty?: number;
  disc?: string;
  price?: string;
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

export const handleReceiptPrint = async (data: ReceiptData, printer: string = "POS80 Printer") => {
    try {
      const config = qz.configs.create(printer);
      if (config.setEncoding) {
        config.setEncoding('UTF-8');
      }

      const sanitize = (value: string = '') => value.toString().replace(/"/g, "'")
      const pad = (text: string, width: number, align: 'left' | 'right' = 'left') => {
        const safe = text.length > width ? text.slice(0, width - 1) + '…' : text;
        return align === 'right'
          ? ' '.repeat(Math.max(0, width - safe.length)) + safe
          : safe + ' '.repeat(Math.max(0, width - safe.length));
      }

      const init = '\x1B@'
      const alignCenter = '\x1Ba\x01'
      const alignLeft = '\x1Ba\x00'
      const boldOn = '\x1BE\x01'
      const boldOff = '\x1BE\x00'
      const doubleSize = '\x1D!\x11'
      const normalSize = '\x1D!\x00'
      const cut = '\x1DV\x00'
      const newLine = '\n'

      const headerParts = [
        init,
        alignCenter,
        boldOn,
        doubleSize,
        `${sanitize(data.name || '')}`,
        boldOff,
        normalSize,
        newLine,
      ];

      const addressParts = data.address
        ? [alignCenter, `${sanitize(data.address)}`, newLine]
        : [];

      const transactionLines = [
        alignLeft,
        '----------------------------------------',
        newLine,
        `Invoice: ${sanitize(data.invoice || '')}`,
        newLine,
        `Cashier: ${sanitize(data.cashier || '')}`,
        newLine,
        `Date: ${sanitize(data.createdAt || '')}`,
        newLine,
        '----------------------------------------',
        newLine,
        pad('Item', 18),
        pad('Qty', 4, 'right'),
        pad('Price', 10, 'right'),
        pad('Disc', 10, 'right'),
        newLine,
        '----------------------------------------',
        newLine,
        ...(data.transactions || []).flatMap((item) => {
          const itemName = sanitize(item.item || '');
          const qtyText = (item.qty || 0).toString();
          const priceText = sanitize(item.price || '');
          const discText = sanitize(item.disc || '');
          return [
            pad(itemName, 18),
            pad(qtyText, 4, 'right'),
            pad(priceText, 10, 'right'),
            pad(discText, 10, 'right'),
            newLine,
          ];
        }),
        '----------------------------------------',
        newLine,
      ];

      const totalLines = ['Subtotal', 'Discount', 'Tax', 'Total'].flatMap((label) => {
        const value = data[label.toLowerCase() as keyof ReceiptData] as string | undefined;
        return [
          pad(`${label}:`, 28),
          pad(sanitize(value || ''), 14, 'right'),
          newLine,
        ];
      });

      const footerParts = data.footer
        ? [newLine, alignCenter, `${sanitize(data.footer)}`, newLine]
        : [];

      const receipt = [
        ...headerParts,
        ...addressParts,
        ...transactionLines,
        ...totalLines,
        ...footerParts,
        newLine,
        cut,
      ].join('');

      await qz.print(config, [receipt]);
      console.log("Receipt printed successfully!");
    } catch (error) {
      console.error("Printing failed:", error);
    }
  };