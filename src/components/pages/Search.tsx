import useSearchState from "../../hooks/useSearchState";
import { AppShell, rem } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import AppHeader from "../shared/AppHeader";
import StoryView from "../search/StoryView";
import StoryFilters from "../search/StoryFilters";
import AppFooter from "../shared/AppFooter";

const Search: React.FC = () => {
  const {
    searchTerm,
    selectedContent,
    selectedSort,
    selectedDate,
    activePage,
    suggestions,
    handleSearchInput,
    handleSearchSubmit,
    handleContentChange,
    handleSortSelect,
    handleDateSelect,
    handleActivePage,
  } = useSearchState();

  // Collaspe the header when user scrolls
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      padding="md"
      header={{ height: 65, collapsed: !pinned, offset: false }}
      footer={{ height: { base: 80, xs: 60 } }}
      pos="relative"
    >
      <AppShell.Header>
        <AppHeader
          searchTerm={searchTerm}
          handleSearchInput={handleSearchInput}
          handleSearchSubmit={handleSearchSubmit}
          suggestions={suggestions}
        />
      </AppShell.Header>
      <AppShell.Main
        maw={`calc(${rem(800)} + 2*var(--mantine-spacing-md))`}
        m="auto"
        pt={`calc(${rem(65)} + var(--mantine-spacing-md))`}
      >
        <StoryFilters
          selectedContent={selectedContent}
          handleContentChange={handleContentChange}
          selectedSort={selectedSort}
          handleSortSelect={handleSortSelect}
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
        />
        <StoryView    
          selectedContent={selectedContent}
          activePage={activePage}
          handleActivePage={handleActivePage}
        />
      </AppShell.Main>
      <AppShell.Footer pos="absolute" bottom={0} p="lg">
        <AppFooter />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Search;