(function attachResearchPatternLibraryLoader(root) {
  const EMPTY_LIBRARY = {
    libraryId: "research-pattern-library-empty",
    version: "0.0.0",
    visibility: "internal_only",
    patterns: []
  };

  function validateLibrary(candidate) {
    if (!candidate || typeof candidate !== "object" || !Array.isArray(candidate.patterns)) {
      return EMPTY_LIBRARY;
    }
    return {
      ...candidate,
      visibility: "internal_only",
      patterns: candidate.patterns.filter((pattern) =>
        pattern
        && typeof pattern.patternId === "string"
        && Array.isArray(pattern.patternMarkers)
        && Array.isArray(pattern.itemCandidates)
      )
    };
  }

  async function loadResearchPatternLibrary() {
    try {
      const response = await fetch("research-pattern-library-v2.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const library = validateLibrary(await response.json());
      root.RESEARCH_PATTERN_LIBRARY = library;
      root.RESEARCH_PATTERN_LIBRARY_STATUS = {
        loaded: true,
        patternCount: library.patterns.length,
        message: "Interne Musterbibliothek geladen."
      };
      root.dispatchEvent?.(new CustomEvent("research-pattern-library-loaded", { detail: root.RESEARCH_PATTERN_LIBRARY_STATUS }));
      return library;
    } catch (error) {
      const fallback = Array.isArray(root.RESEARCH_PATTERN_LIBRARY?.patterns) && root.RESEARCH_PATTERN_LIBRARY.patterns.length
        ? root.RESEARCH_PATTERN_LIBRARY
        : EMPTY_LIBRARY;
      root.RESEARCH_PATTERN_LIBRARY = fallback;
      root.RESEARCH_PATTERN_LIBRARY_STATUS = {
        loaded: fallback !== EMPTY_LIBRARY,
        patternCount: fallback.patterns.length,
        message: fallback !== EMPTY_LIBRARY
          ? "Interne Musterbibliothek aus lokalem Fallback bereit."
          : "Interne Musterbibliothek nicht geladen; Fallback ohne Forschungsschicht aktiv.",
        error: String(error?.message ?? error)
      };
      root.dispatchEvent?.(new CustomEvent("research-pattern-library-loaded", { detail: root.RESEARCH_PATTERN_LIBRARY_STATUS }));
      return EMPTY_LIBRARY;
    }
  }

  root.RESEARCH_PATTERN_LIBRARY = root.RESEARCH_PATTERN_LIBRARY ?? EMPTY_LIBRARY;
  root.RESEARCH_PATTERN_LIBRARY_STATUS = root.RESEARCH_PATTERN_LIBRARY_STATUS ?? { loaded: false, patternCount: 0, message: "Musterbibliothek lädt." };
  root.loadResearchPatternLibrary = loadResearchPatternLibrary;
  loadResearchPatternLibrary();
})(typeof window !== "undefined" ? window : globalThis);
