import type { SelectorID } from '../Selector.js'

/**
 * The app catches this request and displays a banner at the top that initiates cloudflare bypass
 *
 * NOTE: You must have {@link SourceIntents.CLOUDFLARE_BYPASS_PROVIDING} for this to work
 */
export class FormConfirmationError extends Error {
  public readonly type = 'confirmationError'

  constructor(
    public readonly onConfirmation: SelectorID<() => Promise<void>>,
    message: string
  ) {
    super(message)
  }
}
