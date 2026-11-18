import { requireManager } from '../../utils/manager-auth'

export default defineEventHandler(async event => ({ username: await requireManager(event) }))
