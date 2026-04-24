import { AdvancedSearchForm } from "../../impl/interfaces/SearchResultsProviding.js";
import { InputRow, LabelRow } from "../../impl/SettingsUI/FormItemElement.js";
import { FlowSection, Section, type FormSectionElement } from "../../impl/SettingsUI/FormSection.js";
import { closureSelector, type SelectorID } from "../../impl/Selector.js";

type FilterOption = {
  id: string;
  value: string;
};

interface DropdownSearchFilter {
  type: 'dropdown';
  id: string;
  title: string;
  options: FilterOption[];
  value: string;
}

interface SelectSearchFilter {
  type: 'multiselect';
  id: string;
  title: string;
  options: FilterOption[];
  value: Record<string, 'included' | 'excluded'>;
  allowExclusion: boolean;
  allowEmptySelection: boolean;
  maximum: number | undefined;
}

interface InputSearchFilter {
  type: 'input';
  id: string;
  title: string;
  placeholder: string;
  value: string;
}

export type SearchFilter = DropdownSearchFilter | SelectSearchFilter | InputSearchFilter;

export type SearchFilterValue = {
  id: string
  value: string | Record<string, 'included' | 'excluded'>
}

export class SearchFilterForm extends AdvancedSearchForm {
  filters?: SearchFilter[] | Error
  selectedFilterValues: Record<SearchFilterValue['id'], SearchFilterValue['value']>

  constructor(
    values: SearchFilterValue[] | undefined,
    filters: SearchFilter[] | Promise<SearchFilter[]>
  ) {
    super()
    this.selectedFilterValues = {}

    for (const value of values ?? []) {
      this.selectedFilterValues[value.id] = value.value
    }

    if (filters instanceof Promise) {
      this.filters = undefined
      filters.then(filters => this.filters = filters)
        .catch(error => this.filters = error)
        .finally(() => this.reloadForm())
    } else {
      this.filters = filters
    }
  }

  override getSections(): FormSectionElement<unknown>[] {
    if (!this.filters) {
      return [
        Section('loading', [LabelRow('loading', { title: "Loading Filters" })])
      ]
    } else if (this.filters instanceof Error) {
      return [
        Section('error', [LabelRow('error', { title: "Error loading search filters", subtitle: this.filters.message })])
      ]
    } else {
      return this.filters.map(filter => {
        switch (filter.type) {
          case "dropdown": {
            const selectedOptionId = (this.selectedFilterValues[filter.id] ?? filter.value) as (typeof filter.value)
            return Section({ id: filter.id, header: filter.title }, filter.options.map(option => {
              return LabelRow(option.id, {
                title: option.value,
                value: selectedOptionId == option.id ? "✓" : undefined,
                onSelect: closureSelector(this, `${filter.id}#${option.id}`, async () => {
                  this.selectedFilterValues[filter.id] = option.id
                  this.reloadForm()
                })
              })
            }))
          }
          case "multiselect": {
            const selectedOptions = (this.selectedFilterValues[filter.id] ?? filter.value) as (typeof filter.value)
            return FlowSection({ id: filter.id, header: filter.title }, filter.options.map(option => {
              let value: string | undefined
              let style: { titleColor?: string, subtitleColor?: string, backgroundColor?: string } | undefined
              switch (selectedOptions[option.id]) {
                case 'included': {
                  value = "✓"
                  style = { titleColor: "#fff", backgroundColor: "success" }
                  break
                }
                case 'excluded': {
                  value = "✕"
                  style = { titleColor: "#fff", backgroundColor: "error" }
                  break
                }
              }

              return LabelRow(option.id, {
                title: option.value, value, //style,
                onSelect: closureSelector(this, `${filter.id}#${option.id}`, async () => {
                  let nextState: 'included' | 'excluded' | undefined
                  const currentState = selectedOptions[option.id]
                  const selectedOptionsLength = Object.keys(selectedOptions).length
                  const canSelect = !filter.maximum || selectedOptionsLength < filter.maximum
                  const canDeselect = (filter.allowEmptySelection && selectedOptionsLength == 1) || selectedOptionsLength > 1

                  switch (currentState) {
                    case 'included': {
                      if (filter.allowExclusion) {
                        nextState = 'excluded'
                        break
                      }

                      if (canDeselect) {
                        nextState = undefined
                        break
                      } else {
                        return
                      }
                    }
                    case 'excluded': {
                      if (canDeselect) {
                        nextState = undefined
                        break
                      } else {
                        return
                      }
                    }
                    case undefined: {
                      if (canSelect) {
                        nextState = 'included'
                        break
                      } else {
                        return
                      }
                    }
                  }

                  let newValue = selectedOptions
                  if (nextState != undefined) {
                    newValue[option.id] = nextState
                  } else {
                    delete newValue[option.id]
                  }

                  this.selectedFilterValues[filter.id] = newValue
                  this.reloadForm()
                })
              })
            }))
          }
          case "input": {
            const value = (this.selectedFilterValues[filter.id] ?? filter.value) as (typeof filter.value)
            return Section({ id: filter.id, header: filter.title }, [
              InputRow(filter.id, {
                title: filter.title,
                value: value,
                onValueChange: closureSelector(this, filter.id, async (newValue) => {
                  this.selectedFilterValues[filter.id] = newValue
                  this.reloadForm()
                })
              })
            ])
          }
        }
      })
    }
  }

  override getSearchQueryMetadata(): SearchFilterValue[] {
    if (this.filters && !(this.filters instanceof Error)) {
      return this.filters.map(filter => {
        return { id: filter.id, value: this.selectedFilterValues[filter.id] ?? filter.value }
      })
    } else {
      return []
    }
  }

  override async formDidSubmit(): Promise<void> {
    if (!this.filters) {
      throw new Error("Search filters are loading")
    } else if (this.filters instanceof Error) {
      throw this.filters
    }
  }
}
