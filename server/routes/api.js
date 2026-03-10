import { Router } from 'express'
import { BusinessEvent } from '../models/BusinessEvent.js'

export function createApiRouter(engine) {
  const router = Router()

  router.get('/metrics', (_req, res) => {
    const { metrics, prediction } = engine.snapshot()
    res.json({ metrics, prediction })
  })

  router.get('/events', async (req, res) => {
    const limit = Math.min(200, Number(req.query.limit) || 20)
    const fallback = engine.snapshot().events.slice(0, limit)

    try {
      const docs = await BusinessEvent.find().sort({ timestamp: -1 }).limit(limit).lean()
      if (!docs.length) {
        res.json({ events: fallback })
        return
      }
      const events = docs.map((doc) => ({
        id: doc._id,
        type: doc.type,
        timestamp: doc.timestamp,
        metadata: doc.metadata ?? {},
        impactScore: doc.impactScore,
        value: doc.metadata?.value,
        items: doc.metadata?.items,
      }))
      res.json({ events })
    } catch {
      res.json({ events: fallback })
    }
  })

  router.get('/alerts', (_req, res) => {
    res.json({ alerts: engine.snapshot().alerts.slice(0, 20) })
  })

  router.get('/stress-score', (_req, res) => {
    const { stressScore, stressFactors } = engine.snapshot()
    res.json({ stressScore, stressFactors })
  })

  return router
}
