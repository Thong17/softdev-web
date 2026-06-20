export const playBellSound = () => {
    try {
        const AudioCtx =
            (window as any).AudioContext || (window as any).webkitAudioContext
        if (!AudioCtx) return
        const ctx = new AudioCtx()
        const now = ctx.currentTime

        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
            ctx.resume().catch(() => {})
        }

        const master = ctx.createGain()
        master.gain.setValueAtTime(0.0001, now)
        master.gain.exponentialRampToValueAtTime(1, now + 0.01)
        master.connect(ctx.destination)

        const makeStrike = (start: number, baseFreq: number) => {
            const partials = [1, 2.4, 3.9, 5.7]
            partials.forEach((mult, i) => {
                const o = ctx.createOscillator()
                const g = ctx.createGain()

                o.type = i === 0 ? 'triangle' : 'sine'
                const detune = 1 + (Math.random() - 0.5) * 0.01
                o.frequency.setValueAtTime(baseFreq * mult * detune, start)

                const peak = 0.6 / (i + 1)
                g.gain.setValueAtTime(0.0001, start)
                g.gain.exponentialRampToValueAtTime(peak, start + 0.01)
                g.gain.exponentialRampToValueAtTime(0.0001, start + 0.45)

                // Filter slightly for more metallic timbre
                const hp = ctx.createBiquadFilter()
                hp.type = 'highpass'
                hp.frequency.setValueAtTime(350 + i * 150, start)

                o.connect(g)
                g.connect(hp)
                hp.connect(master)

                o.start(start)
                o.stop(start + 0.5)
            })
        }

        // Bicycle ring-ring: two quick strikes
        makeStrike(now, 1200)
        makeStrike(now + 0.18, 920)

        master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)

        setTimeout(() => {
            try {
                ctx.close()
            } catch (e) {
                /* ignore */
            }
        }, 1500)
    } catch (e) {
        // ignore
    }
}
