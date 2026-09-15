export const EVENTS = {
  FUNNEL_STEP_VIEWED: 'funnel_step_viewed',
  NAME_SUBMITTED: 'name_submitted',
  EMAIL_SUBMITTED: 'email_submitted',
  DEBT_SUBMITTED: 'debt_submitted',
  OTP_REQUEST_ATTEMPTED: 'otp_request_attempted',
  OTP_REQUEST_SUCCEEDED: 'otp_request_succeeded',
  OTP_REQUEST_FAILED: 'otp_request_failed',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]

// A new event with no entry here is a type error. That is the point.
export interface EventPropertiesMap {
  [EVENTS.FUNNEL_STEP_VIEWED]: { session_id: string; step: number }
  [EVENTS.NAME_SUBMITTED]: { session_id: string }
  [EVENTS.EMAIL_SUBMITTED]: { session_id: string }
  [EVENTS.DEBT_SUBMITTED]: { session_id: string; band: string }
  [EVENTS.OTP_REQUEST_ATTEMPTED]: { session_id: string }
  [EVENTS.OTP_REQUEST_SUCCEEDED]: { session_id: string }
  [EVENTS.OTP_REQUEST_FAILED]: { session_id: string; status: number }
}

// DECOUPLED FROM UI STATE ON PURPOSE.
// The PostHog funnel is defined over these indices and weeks of history depend on them.
// Reordering the UI must not silently renumber the funnel.
export const FUNNEL_STEP_MAP: Record<number, EventName> = {
  1: EVENTS.NAME_SUBMITTED,
  2: EVENTS.EMAIL_SUBMITTED,
  3: EVENTS.DEBT_SUBMITTED,
  4: EVENTS.OTP_REQUEST_ATTEMPTED,
}
