import type { Access } from 'payload'

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const publicRead: Access = () => true

export const adminWrite: Access = ({ req }) => Boolean(req.user)
