import { HomeSection, PagedResults } from "../..";

export interface HomePageSectionsProviding {
  /**
   * A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
   * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
   * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
   * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
   * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
   * @param sectionCallback A callback which is run for each independant HomeSection.  
   */
  getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void>

  /**
   * This function will take a given homepageSectionId and metadata value, and with this information, should return
   * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
   * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
   * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about 
   * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
   * function. It initially starts out as null. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified,
   * the modified version will be supplied to this function instead of the origional {@link getHomePageSections}'s version. 
   * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
   */
  getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults>
}