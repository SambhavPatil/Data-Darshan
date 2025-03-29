import React, { useState, useEffect, useRef } from 'react';

interface SearchResult {
  text: string;
  node: Node;
  index: number;
}

interface PageSearchProps {
  className?: string;
}

const PageSearch: React.FC<PageSearchProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Function to search for text in all text nodes of the document
  const searchText = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    setIsSearching(true);
    
    // Use setTimeout to prevent UI blocking during search
    setTimeout(() => {
      const foundResults: SearchResult[] = [];
      const searchRegex = new RegExp(searchTerm, 'gi');
      
      // Function to traverse DOM and find text nodes
      const findTextNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const content = node.textContent || '';
          let match;
          while ((match = searchRegex.exec(content)) !== null) {
            foundResults.push({
              text: match[0],
              node,
              index: match.index
            });
          }
        } else {
          // Skip searching within the search component itself
          if (node === searchBoxRef.current) return;
          
          // Recursively search child nodes
          for (let i = 0; i < node.childNodes.length; i++) {
            findTextNodes(node.childNodes[i]);
          }
        }
      };
      
      // Start searching from body
      findTextNodes(document.body);
      
      setResults(foundResults);
      setCurrentResultIndex(foundResults.length > 0 ? 0 : -1);
      setIsSearching(false);
      
      // Highlight first result if found
      if (foundResults.length > 0) {
        highlightResult(foundResults[0]);
      }
    }, 0);
  };

  // Function to highlight a specific result
  const highlightResult = (result: SearchResult) => {
    // First, remove any existing highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });
    
    // Create text range to highlight the result
    const range = document.createRange();
    const textNode = result.node;
    
    // Split the text node at the start and end of the match
    const startOffset = result.index;
    const endOffset = startOffset + result.text.length;
    
    // Create highlight element
    try {
      range.setStart(textNode, startOffset);
      range.setEnd(textNode, endOffset);
      
      const span = document.createElement('span');
      span.className = 'search-highlight';
      span.style.backgroundColor = '#FFFF00';
      span.style.color = '#000000';
      
      range.surroundContents(span);
      
      // Scroll to the highlight
      span.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } catch (e) {
      console.error('Error highlighting text:', e);
    }
  };

  // Handle next/previous result navigation
  const navigateResults = (direction: 'next' | 'prev') => {
    if (results.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentResultIndex + 1) % results.length;
    } else {
      newIndex = (currentResultIndex - 1 + results.length) % results.length;
    }
    
    setCurrentResultIndex(newIndex);
    highlightResult(results[newIndex]);
  };

  // Ref for the search box to avoid searching within itself
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Initialize keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      // F3 or Enter when focused for next result
      if (e.key === 'F3' || (e.key === 'Enter' && document.activeElement === searchInputRef.current)) {
        e.preventDefault();
        navigateResults('next');
      }
      
      // Shift+F3 or Shift+Enter for previous result
      if ((e.key === 'F3' && e.shiftKey) || 
          (e.key === 'Enter' && e.shiftKey && document.activeElement === searchInputRef.current)) {
        e.preventDefault();
        navigateResults('prev');
      }
      
      // Escape to close/clear search
      if (e.key === 'Escape') {
        setSearchTerm('');
        setResults([]);
        setCurrentResultIndex(-1);
        
        // Remove highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
          const parent = el.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            parent.normalize();
          }
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [results, currentResultIndex]);

  // Add CSS styles for the search box
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .header-search-box {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 100%;
      }
      
      .search-input-container {
        display: flex;
        align-items: center;
      }
      
      .search-input {
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        width: 200px;
      }
      
      .search-button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 6px 10px;
        margin: 0 2px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .search-button:hover {
        background-color: #e0e0e0;
      }
      
      .search-navigation {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .search-result-count {
        font-size: 14px;
        color: #666;
        white-space: nowrap;
      }
      
      .search-nav-buttons {
        display: flex;
        gap: 2px;
      }
      
      .search-highlight {
        background-color: #FFFF00;
        color: #000000;
      }
      
      @media (max-width: 768px) {
        .header-search-box {
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }
        
        .search-input {
          width: 150px;
        }
        
        .search-result-count {
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      ref={searchBoxRef} 
      className={`header-search-box ${className || ''}`}
    >
      <div className="search-input-container">
        <input
          ref={searchInputRef}
          className="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in page"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                navigateResults('prev');
              } else if (results.length > 0) {
                navigateResults('next');
              } else {
                searchText();
              }
            }
          }}
        />
        <button 
          className="search-button"
          onClick={searchText}
          disabled={isSearching}
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>
      
      <div className="search-navigation">
        <div className="search-result-count">
          {results.length > 0 
            ? `${currentResultIndex + 1}/${results.length}` 
            : searchTerm.trim() 
              ? 'No matches' 
              : ''}
        </div>
        <div className="search-nav-buttons">
          <button 
            className="search-button"
            onClick={() => navigateResults('prev')}
            disabled={results.length === 0}
          >
            ↑
          </button>
          <button 
            className="search-button"
            onClick={() => navigateResults('next')}
            disabled={results.length === 0}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSearch;