# Requirements Document

## Introduction

AI Apartment is a web platform for discovering, understanding, searching, filtering, and comparing AI tools organized by category. The "apartment" metaphor represents different AI capabilities as rooms — each category is a room that users can explore to find the right tool for their task.

The MVP delivers a fully functional platform where users can browse AI categories, explore structured tool records, search and filter the catalogue, view detailed tool pages, compare tools side by side, and save favorites. All data is served through a FastAPI backend backed by Firestore; the React frontend never accesses Firestore or AI APIs directly.

---

## Glossary

- **Platform**: The AI Apartment web application as a whole (frontend + backend).
- **Frontend**: The React + Vite application served to users in the browser.
- **Backend**: The Python FastAPI application that serves all API requests.
- **Firestore**: The Firebase Firestore database used as the primary data store.
- **API**: The RESTful HTTP interface exposed by the Backend.
- **Category**: A named grouping of AI tools representing a capability domain (e.g., "Image Generation", "Coding AI"). Equivalent to a "room" in the apartment metaphor.
- **Tool**: A structured record representing a single AI product or service, containing all fields defined in Requirement 3.
- **Tool_Record**: The full structured data object for a Tool as stored in Firestore and returned by the API.
- **Catalogue**: The complete collection of Tool records available through the Platform.
- **Search_Query**: A string entered by the user to find matching Tools.
- **Filter_Set**: A collection of one or more filter parameters applied to narrow search or browse results.
- **Comparison_Set**: A user-selected collection of two or more Tools to compare side by side.
- **Favorites**: A user-maintained list of Tools saved for later reference, persisted client-side.
- **Pricing_Type**: One of four labels — "Completely Free", "Freemium", "Free Trial", or "Paid Only" — applied to every Tool.
- **Free_Tier_Details**: Structured information about a Tool's free usage limits, including credits, generation counts, daily/monthly caps, watermark status, feature restrictions, API limits, and commercial-use restrictions.
- **Services_Layer**: The `frontend/src/services/` directory containing all Axios API call functions. Components must not construct API requests directly.
- **Router**: A FastAPI route module in `backend/app/routers/` scoped to a single concern domain.
- **Verified_Date**: The date on which a Tool's pricing and free-tier information was last confirmed to be accurate.

---

## Requirements

### Requirement 1: Home Page

**User Story:** As a visitor, I want a clear and welcoming home page, so that I can immediately understand what AI Apartment is and begin discovering tools.

#### Acceptance Criteria

1. THE Frontend SHALL display a home page at the root URL (`/`) that includes the platform name, tagline ("One apartment. Different AI capabilities."), and a brief description of the platform's purpose of no more than 300 characters.
2. THE Frontend SHALL display a prominent search bar on the home page that accepts a Search_Query of 1 to 200 characters and navigates to the search results page on submission.
3. THE Frontend SHALL display all Categories on the home page as navigable cards or tiles, where each card shows the Category name.
4. WHEN a user clicks a Category card on the home page, THE Frontend SHALL navigate to the Category browse page for that Category.
5. THE Frontend SHALL display a curated selection of between 4 and 12 Tools on the home page, each showing at minimum the Tool name and Category.
6. WHILE the home page is loading data from the Backend, THE Frontend SHALL display a visible loading indicator in place of each content section being fetched.
7. IF the Backend returns an error when loading home page data, THEN THE Frontend SHALL display an error message indicating the failure and a retry control that re-initiates the same data request.
8. THE Frontend SHALL render the home page correctly on viewport widths from 320px to 1920px, adjusting layout so that no content is clipped or requires horizontal scrolling.
9. IF the Backend returns zero Categories, THEN THE Frontend SHALL display a message indicating that no categories are available.

---

### Requirement 2: AI Category Browsing

**User Story:** As a user, I want to browse AI tools organized by category, so that I can explore all tools available in a specific capability domain.

#### Acceptance Criteria

1. WHEN a user navigates to `/categories`, THE Frontend SHALL display a listing of all Categories whose `active` field is `true`, ordered alphabetically by Category name.
2. WHEN a user navigates to `/categories/{category-slug}`, THE Frontend SHALL resolve the slug to a Category record and display the Category name, description, and all Tools belonging to that Category whose `active` field is `true`, ordered alphabetically by Tool name.
3. WHEN the `GET /categories` endpoint is called, THE Backend SHALL return all Category records whose `active` field is `true`, ordered alphabetically by name.
4. WHEN the `GET /categories/{category_id}/tools` endpoint is called, THE Backend SHALL return all Tool records belonging to the specified Category whose `active` field is `true`, ordered alphabetically by Tool name.
5. IF the specified `category_id` does not exist in Firestore, THEN THE Backend SHALL return an HTTP 404 response with a descriptive error message indicating the category was not found.
6. THE Backend SHALL derive Category data from Firestore records, not from hardcoded values in application code.
7. WHILE a Category page is fetching tool data from the Backend, THE Frontend SHALL display a loading indicator in place of the tools list.
8. IF a Category contains no Tools with `active` set to `true`, THEN THE Frontend SHALL display a message indicating no tools are currently listed in that category.
9. IF the Backend returns an error when fetching Category or Tool data, THEN THE Frontend SHALL display an error message indicating the data could not be loaded and SHALL NOT display a partial or empty tools list without explanation.
10. THE Platform architecture SHALL support adding a new Category by inserting a Firestore record with `active` set to `true` without requiring changes to Frontend source code.
11. IF the slug in `/categories/{category-slug}` does not match any Category record, THEN THE Frontend SHALL display an error message indicating the category was not found.

---

### Requirement 3: AI Tool Catalogue and Data Model

**User Story:** As a developer or data manager, I want every AI tool to be represented by a consistent structured record, so that the platform can display, search, filter, and compare tools reliably.

#### Acceptance Criteria

1. THE Backend SHALL store each Tool as a Firestore document containing the following fields: `name` (string, 1–200 characters), `description` (string, 1–2000 characters), `category_id` (string), `website_url` (string, valid URL format), `pricing_type` (string — one of "Completely Free", "Freemium", "Free Trial", "Paid Only"), `free_availability` (boolean), `free_tier_details` (object or null), `capabilities` (array of strings, 0–50 items), `input_types` (array of strings, 0–20 items), `output_types` (array of strings, 0–20 items), `watermark_info` (string of 0–500 characters, or null), `api_available` (boolean), `best_use_cases` (array of strings, 0–20 items), `limitations` (array of strings, 0–20 items), `verified_date` (ISO 8601 date string in the format YYYY-MM-DD), `active` (boolean).
2. WHEN a client requests `GET /tools`, THE Backend SHALL return a paginated list of active Tool_Records, where each page contains between 1 and 100 items, and the response includes the total item count, `limit`, and `offset` for the current page.
3. WHEN a client requests `GET /tools/{tool_id}`, THE Backend SHALL return the full Tool_Record for the specified tool within 2000 milliseconds.
4. IF the specified `tool_id` does not exist in Firestore or the matching Tool_Record has `active` set to `false`, THEN THE Backend SHALL return an HTTP 404 response with an error message indicating the tool was not found.
5. IF a Tool record write operation supplies a `pricing_type` value that is not one of "Completely Free", "Freemium", "Free Trial", or "Paid Only", THEN THE Backend SHALL reject the write and return an HTTP 422 response with an error message indicating the invalid value and the list of permitted values.
6. THE API SHALL return Tool_Records in a consistent JSON shape where every field defined in criterion 1 is present, with absent optional fields represented as `null` rather than omitted.
7. THE Frontend Services_Layer SHALL contain all Axios functions for fetching Tool and Category data; page and component files SHALL NOT construct API requests directly.
8. IF a required field (`name`, `description`, `category_id`, `website_url`, `pricing_type`, `free_availability`, `api_available`, `verified_date`, or `active`) is missing or null when a Tool record is written to Firestore, THEN THE Backend SHALL reject the write and return an HTTP 422 response indicating which required field is absent.
9. IF the `GET /tools` request includes a `limit` parameter outside the range of 1 to 100, THEN THE Backend SHALL return an HTTP 422 response indicating the valid page size range.

---

### Requirement 4: AI Tool Detail Page

**User Story:** As a user, I want to view a full detail page for any AI tool, so that I can understand what it does, how it is priced, and whether it fits my needs.

#### Acceptance Criteria

1. THE Frontend SHALL display a tool detail page at `/tools/{tool-id}` showing all fields of the Tool_Record: name, description, category, website link, Pricing_Type, Free_Tier_Details (when present), capabilities, input types, output types, watermark information (when present), API availability, best use cases, limitations, and Verified_Date.
2. THE Frontend SHALL display a clearly labelled link or button that opens the Tool's `website_url` in a new browser tab.
3. THE Frontend SHALL display the Pricing_Type using the exact label from the Pricing_Type vocabulary ("Completely Free", "Freemium", "Free Trial", or "Paid Only") — never a simplified "Free" label.
4. WHEN a Tool's `free_availability` is `true` and `free_tier_details` is present, THE Frontend SHALL display the Free_Tier_Details including any applicable credits, generation limits, daily/monthly caps, watermark status, feature restrictions, API limits, and commercial-use restrictions.
5. THE Frontend SHALL display the Verified_Date on the tool detail page with a label that communicates to users that pricing and free-tier information may have changed since that date.
6. WHILE the tool detail page is loading data, THE Frontend SHALL display a loading indicator visible within 200 milliseconds of navigation to `/tools/{tool-id}`.
7. IF the Backend returns a 404 for the requested tool, THEN THE Frontend SHALL display a not-found message and a link to return to browsing.
8. IF the Backend returns any non-404 error response, THEN THE Frontend SHALL display a user-readable error message describing the failure and the tool detail page SHALL NOT display partial Tool_Record data.
9. IF the Tool's `website_url` is absent or empty, THEN THE Frontend SHALL hide the website link or button rather than rendering a broken or empty link.

---

### Requirement 5: Search

**User Story:** As a user, I want to search for AI tools by name, category, capability, use case, or keyword, so that I can quickly find tools relevant to my needs.

#### Acceptance Criteria

1. THE Frontend SHALL provide a search interface accessible from the home page and from a persistent navigation element.
2. WHEN a user submits a Search_Query of 1 to 200 characters, THE Frontend SHALL send the query to the Backend `GET /tools/search` endpoint and display the matching results.
3. THE Backend SHALL expose a `GET /tools/search` endpoint that accepts a `q` query parameter and returns Tool_Records where the query matches against the tool's `name`, `description`, `category_id`, `capabilities`, or `best_use_cases` fields.
4. IF the `q` parameter is absent or consists only of whitespace, THEN THE Backend SHALL return an HTTP 422 response with a validation error message indicating a non-empty query is required.
5. WHEN the search returns results, THE Frontend SHALL display each matching Tool as a card showing the Tool name, category, Pricing_Type, and a brief description.
6. IF a Search_Query returns no matching Tools, THEN THE Frontend SHALL display an empty-state message informing the user that no results were found.
7. THE Backend SHALL return search results only for active Tools.
8. WHILE search results are loading, THE Frontend SHALL display a loading indicator.
9. IF the Backend returns an error during search, THEN THE Frontend SHALL display a user-readable error message and preserve the search input text so users can modify and resubmit.
10. THE Backend SHALL treat the `q` parameter as case-insensitive when matching Tool fields.
11. THE Backend SHALL return at most 50 search results per response, ordered by relevance to the query.

---

### Requirement 6: Filters

**User Story:** As a user, I want to filter AI tools by category, pricing, capabilities, and other attributes, so that I can narrow down the catalogue to tools that meet my specific criteria.

#### Acceptance Criteria

1. THE Frontend SHALL provide a filter panel on the catalogue and search results pages with controls for: Category, Pricing_Type, Free_Availability (boolean), Capabilities (multi-select), Input_Type (multi-select), Output_Type (multi-select), API_Availability (boolean), and Watermark presence (boolean).
2. WHEN a user applies one or more filters, THE Frontend SHALL send the active Filter_Set to the Backend `GET /tools` endpoint as query parameters and display the filtered results within 3 seconds of filter application.
3. THE Backend `GET /tools` endpoint SHALL accept optional query parameters: `category_id`, `pricing_type`, `free_availability` (boolean), `capabilities` (comma-separated list of up to 20 values), `input_type`, `output_type`, `api_available` (boolean), and `has_watermark` (boolean).
4. WHEN multiple filter parameters are provided, THE Backend SHALL return only Tool_Records that satisfy all provided filter conditions simultaneously (logical AND).
5. WHEN the `capabilities` query parameter contains multiple values, THE Backend SHALL return only Tool_Records whose capabilities include all specified values (logical AND).
6. WHEN no filters are applied, THE Backend `GET /tools` endpoint SHALL return all active Tools paginated in pages of up to 20 Tool_Records per page.
7. IF a filter combination returns no matching Tools, THEN THE Frontend SHALL display an empty-state message indicating no tools matched the active filters and a prompt to clear filters.
8. IF any provided filter parameter value does not match a valid enumeration value, THEN THE Backend SHALL return an HTTP 422 response indicating which parameter is invalid without processing the request.
9. THE Frontend SHALL allow users to clear all active filters with a single interaction, restoring the unfiltered Tool_Record list.
10. THE Frontend SHALL reflect the currently active filters visually so users can see which filters are applied and the total count of active filters.

---

### Requirement 7: Free and Pricing Information Accuracy

**User Story:** As a user, I want accurate and clearly labelled pricing and free-tier information for every tool, so that I am not misled about what is actually free or what restrictions apply.

#### Acceptance Criteria

1. THE Platform SHALL use exactly four Pricing_Type labels — "Completely Free", "Freemium", "Free Trial", "Paid Only" — and no other pricing labels anywhere in the UI or API responses.
2. THE Frontend SHALL never display the label "Free" in isolation to describe a tool's pricing; it SHALL always use the full Pricing_Type label.
3. WHEN a Tool has `pricing_type` of "Freemium" or "Free Trial" and `free_tier_details` is present, THE Frontend SHALL display the Free_Tier_Details, showing each applicable restriction: credits, generation counts, daily limits, monthly limits, watermark information, restricted features, API restrictions, and commercial-use restrictions.
4. WHEN a Tool_Record is displayed, THE Frontend SHALL display the Verified_Date alongside all pricing and free-tier information with a label indicating the information may be outdated if the Verified_Date is more than 90 days before the current date.
5. THE Backend SHALL reject any API write operation that sets `pricing_type` to a value outside the four permitted values, returning an HTTP 422 response with a descriptive validation error message indicating the invalid value and the list of permitted values.
6. WHEN `free_availability` is `false`, THE Frontend SHALL not display Free_Tier_Details even if the field is present in the Tool_Record.
7. IF a Tool has `pricing_type` of "Freemium" or "Free Trial" and `free_tier_details` is absent or empty, THEN THE Frontend SHALL display a notice indicating that free-tier restriction details are unavailable.
8. IF a Tool has `pricing_type` of "Completely Free", THEN THE Frontend SHALL display the Pricing_Type label without any Free_Tier_Details restriction fields.

---

### Requirement 8: Tool Comparison

**User Story:** As a user, I want to select multiple AI tools and compare them side by side, so that I can make an informed decision about which tool best fits my needs.

#### Acceptance Criteria

1. THE Frontend SHALL allow users to add a Tool to the Comparison_Set from the tool detail page and from tool listing cards, provided the Tool is not already present in the Comparison_Set.
2. THE Frontend SHALL display a persistent comparison indicator showing how many Tools are currently in the Comparison_Set, updated within 1 second of any addition or removal.
3. WHEN the Comparison_Set contains two or more Tools, THE Frontend SHALL provide a navigation element to open the comparison view.
4. IF the Comparison_Set already contains 4 Tools, THEN THE Frontend SHALL disable the add-to-comparison control and display a message indicating the maximum of 4 Tools has been reached.
5. THE Frontend SHALL display the comparison view at `/compare` as a side-by-side table or grid showing: name, category, Pricing_Type, Free_Tier_Details summary, API_Availability, `capabilities`, `input_types`, `output_types`, `watermark_info`, `best_use_cases`, and `limitations` for each Tool in the Comparison_Set.
6. IF a field value is not available for a Tool in the Comparison_Set, THEN THE Frontend SHALL display a "Not available" indicator in that cell rather than leaving the cell blank.
7. THE Frontend SHALL present the comparison as factual side-by-side data and SHALL NOT declare any Tool in the Comparison_Set as universally "best" or superior.
8. THE Frontend SHALL allow users to remove a Tool from the Comparison_Set from within the comparison view.
9. THE Frontend SHALL allow users to clear the entire Comparison_Set with a single interaction.
10. WHEN the Comparison_Set contains fewer than 2 Tools after a removal, THE Frontend SHALL navigate the user away from the comparison view and display a message indicating that at least 2 Tools are required to compare.
11. WHILE the comparison view is loading Tool data, THE Frontend SHALL display a loading indicator.
12. IF a Tool in the Comparison_Set cannot be loaded from the Backend, THEN THE Frontend SHALL display a per-tool error message in that Tool's column in the comparison view without hiding the successfully loaded Tools.

---

### Requirement 9: Favorites

**User Story:** As a user, I want to save AI tools as favorites, so that I can quickly return to tools I am interested in.

#### Acceptance Criteria

1. THE Frontend SHALL allow users to mark any Tool as a favorite by interacting with a toggle control on the tool detail page and on tool listing cards.
2. THE Frontend SHALL persist the Favorites list as a collection of Tool IDs in the browser's localStorage, with a maximum of 500 saved Tool IDs, so that it survives page refreshes and navigation within the same browser session.
3. THE Frontend SHALL provide a dedicated favorites page at `/favorites` displaying all Tools the user has saved as favorites, sorted by the order in which they were added (most recently added first).
4. WHEN a Tool has been added to Favorites, THE Frontend SHALL display a filled visual indicator on the tool's card and detail page; WHEN a Tool has not been added to Favorites, THE Frontend SHALL display an unfilled visual indicator.
5. THE Frontend SHALL allow users to remove a Tool from Favorites by interacting with the same toggle control from both the favorites page and from the tool's card or detail page, updating the visual indicator immediately upon removal.
6. IF the user has no saved Favorites, THEN THE Frontend SHALL display an empty-state message on the `/favorites` page with a navigable prompt linking to the tools listing page.
7. WHILE the favorites page is loading Tool data for saved Tool IDs, THE Frontend SHALL display a loading indicator and suppress the tool list until loading is complete.
8. IF a saved favorite Tool ID no longer exists in the Backend, THEN THE Frontend SHALL display a placeholder entry in the favorites list indicating that the tool is no longer available, and SHALL provide a dismiss control allowing the user to remove it from the Favorites list.
9. IF the Favorites list has reached the maximum of 500 saved Tool IDs and the user attempts to add another Tool, THEN THE Frontend SHALL display an error message indicating the favorites limit has been reached and SHALL NOT add the Tool to the Favorites list.

---

### Requirement 10: Backend API Structure and Validation

**User Story:** As a developer, I want a well-structured FastAPI backend with consistent validation and error handling, so that the frontend receives predictable responses and data integrity is maintained.

#### Acceptance Criteria

1. THE Backend SHALL be structured with Router modules in `backend/app/routers/` separated by domain: `tools.py`, `categories.py`, and `search.py`.
2. THE Backend SHALL use Pydantic models in `backend/app/models/` for all request and response schemas.
3. IF a request fails Pydantic validation, THEN THE Backend SHALL return HTTP 422 with a JSON error body containing a `detail` field that lists each validation error with the failing field name and the reason for failure.
4. IF a request targets a resource that does not exist, THEN THE Backend SHALL return HTTP 404 with a JSON error body containing a `detail` field with a message indicating the resource was not found.
5. IF an unhandled internal error occurs, THEN THE Backend SHALL return HTTP 500 with a JSON error body containing a `detail` field with a generic error message, and SHALL NOT include stack traces, internal module paths, or exception class names in the response body.
6. THE Backend SHALL read Firestore credentials and configuration from environment variables defined in a `.env` file; credentials SHALL NOT be hardcoded in application code.
7. THE Backend SHALL expose a `GET /health` endpoint that returns HTTP 200 with a JSON body containing a `status` field with the value `"ok"`.
8. WHERE a `CORS_ALLOWED_ORIGINS` environment variable is set, THE Backend SHALL enable CORS and allow requests only from the origins listed in that variable.
9. THE Backend `GET /tools` endpoint SHALL support `limit` (integer, 1–100, default 20) and `offset` (integer, minimum 0, default 0) query parameters for pagination; IF either parameter is outside its valid range or is not an integer, THEN THE Backend SHALL return HTTP 422 with a validation error body as defined in criterion 3.
10. THE API SHALL return all list responses in a consistent envelope shape containing `data` (array of records), `total` (total matching count), `limit`, and `offset`.

---

### Requirement 11: Frontend Architecture and Quality

**User Story:** As a developer, I want the frontend codebase to follow consistent architecture conventions, so that the application is maintainable and extensible as the catalogue grows.

#### Acceptance Criteria

1. THE Frontend SHALL place all Axios API call functions in `frontend/src/services/`; page and component files SHALL NOT construct HTTP requests directly.
2. THE Frontend SHALL use React Router for all client-side navigation with routes defined for: `/` (home), `/categories` (category list), `/categories/:categorySlug` (category tools), `/tools/:toolId` (tool detail), `/search` (search results), `/compare` (comparison view), and `/favorites` (favorites page).
3. THE Frontend SHALL use reusable components in `frontend/src/components/` for elements used across two or more distinct pages (e.g., ToolCard, CategoryCard, FilterPanel, LoadingSpinner, ErrorMessage, EmptyState).
4. WHILE data is being fetched for a data-driven page or list view, THE Frontend SHALL display a LoadingSpinner component in place of the content.
5. IF data fetching fails for a data-driven page or list view, THEN THE Frontend SHALL display an ErrorMessage component with a user-readable description of the failure.
6. IF a data-driven page or list view returns zero records, THEN THE Frontend SHALL display an EmptyState component with a contextual message.
7. WHEN a user submits a search query, THE Frontend SHALL validate that the query is between 1 and 200 characters and contains at least one non-whitespace character before sending the request; IF validation fails, THE Frontend SHALL display an inline error message and SHALL NOT send the request to the Backend.
8. THE Frontend SHALL use Tailwind CSS utility classes for all styling; custom CSS SHALL be added only where no equivalent Tailwind utility class exists.
9. THE Frontend SHALL use environment variables (via Vite's `import.meta.env`) for the Backend base URL and SHALL NOT hardcode URLs in source files.
