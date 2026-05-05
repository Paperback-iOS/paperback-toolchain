import type { Metadata } from '../../Metadata.js'
import type { PagedResults } from '../../PagedResults.js'
import type { SearchQuery } from '../../SearchQuery.js'
import type { SearchResultItem } from '../../SearchResultItem.js'
import type { SortingOption } from '../../SortingOption.js'
import type { SourceManga } from '../../SourceManga.js'
import { Form } from '../SettingsUI/Form.js'
import type { FormSectionElement } from '../SettingsUI/FormSection.js'
import { hasPropertiesOf } from './index.js'
import type { MangaProviding } from './MangaProviding.js'

/**
 * @deprecated Use {@link SearchResultsProviding}
 */
export type Searchable = SearchResultsProviding

export interface SearchResultsProviding extends MangaProviding {
  getSearchResults(
    query: SearchQuery<Metadata>,
    metadata: Metadata | undefined,
    sortingOption: SortingOption | undefined
  ): Promise<PagedResults<SearchResultItem>>

  getSortingOptions?(query: SearchQuery<Metadata>): Promise<SortingOption[]>
  getAdvancedSearchForm?(
    query: SearchQuery<Metadata>
  ): Promise<AdvancedSearchForm>
}

export function implementsSearchResultsProviding(
  extension: MangaProviding
): extension is SearchResultsProviding {
  return hasPropertiesOf<SearchResultsProviding>(
    ['getSearchResults'],
    extension
  )
}

export abstract class AdvancedSearchForm extends Form {
  /**
   * This is always true
   */
  override readonly requiresExplicitSubmission = true as const

  /**
   * Build and return a fully qualified SearchQuery based on the user's
   * selection in the form
   *
   * Notes:
   * - This is called after successful {@link AdvancedSearchForm.formDidSubmit}
   * - Errors thrown from here are logged, dismissal is not blocked, and
   *   metadata is reset to undefined in the resulting search query
   */
  abstract getSearchQueryMetadata(): Metadata

  override async formDidSubmit(): Promise<void> {}
  override formDidCancel(): void {}
}
