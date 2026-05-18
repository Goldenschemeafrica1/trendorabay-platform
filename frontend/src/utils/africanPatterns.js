// African pattern definitions for design elements
export const AFRICAN_PATTERNS = {
  // Kente patterns (Ghana)
  kente: {
    name: 'Kente',
    origin: 'Ghana',
    description: 'Traditional Ghanaian textile with geometric patterns',
    colors: ['#FFD700', '#FF6B35', '#004E89', '#A23B72', '#F18F01'],
    patterns: [
      {
        id: 'kente-diamond',
        name: 'Diamond Kente',
        description: 'Diamond-shaped geometric pattern',
        cssClass: 'pattern-kente-diamond',
      },
      {
        id: 'kente-stripes',
        name: 'Striped Kente',
        description: 'Horizontal stripe pattern',
        cssClass: 'pattern-kente-stripes',
      },
      {
        id: 'kente-checkerboard',
        name: 'Checkerboard Kente',
        description: 'Checkerboard geometric pattern',
        cssClass: 'pattern-kente-checkerboard',
      },
    ],
  },

  // Ankara patterns (West Africa)
  ankara: {
    name: 'Ankara',
    origin: 'West Africa',
    description: 'Vibrant wax print fabric with bold patterns',
    colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'],
    patterns: [
      {
        id: 'ankara-floral',
        name: 'Floral Ankara',
        description: 'Floral-inspired pattern',
        cssClass: 'pattern-ankara-floral',
      },
      {
        id: 'ankara-geometric',
        name: 'Geometric Ankara',
        description: 'Bold geometric shapes',
        cssClass: 'pattern-ankara-geometric',
      },
      {
        id: 'ankara-abstract',
        name: 'Abstract Ankara',
        description: 'Abstract artistic pattern',
        cssClass: 'pattern-ankara-abstract',
      },
    ],
  },

  // Bogolanfini patterns (Mali)
  bogolanfini: {
    name: 'Bogolanfini (Mud Cloth)',
    origin: 'Mali',
    description: 'Traditional Malian mud cloth with earth tones',
    colors: ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#FAEBD7'],
    patterns: [
      {
        id: 'mud-cloth-lines',
        name: 'Line Pattern',
        description: 'Linear mud cloth design',
        cssClass: 'pattern-mud-lines',
      },
      {
        id: 'mud-cloth-dots',
        name: 'Dot Pattern',
        description: 'Dotted mud cloth design',
        cssClass: 'pattern-mud-dots',
      },
      {
        id: 'mud-cloth-spiral',
        name: 'Spiral Pattern',
        description: 'Spiral mud cloth design',
        cssClass: 'pattern-mud-spiral',
      },
    ],
  },

  // Shweshwe patterns (South Africa)
  shweshwe: {
    name: 'Shweshwe',
    origin: 'South Africa',
    description: 'Traditional South African printed fabric',
    colors: ['#4169E1', '#FF69B4', '#32CD32', '#FFD700', '#8B008B'],
    patterns: [
      {
        id: 'shweshwe-circles',
        name: 'Circle Shweshwe',
        description: 'Circular pattern design',
        cssClass: 'pattern-shweshwe-circles',
      },
      {
        id: 'shweshwe-diamond',
        name: 'Diamond Shweshwe',
        description: 'Diamond-shaped pattern',
        cssClass: 'pattern-shweshwe-diamond',
      },
      {
        id: 'shweshwe-floral',
        name: 'Floral Shweshwe',
        description: 'Floral-inspired pattern',
        cssClass: 'pattern-shweshwe-floral',
      },
    ],
  },

  // Kitenge patterns (East Africa)
  kitenge: {
    name: 'Kitenge',
    origin: 'East Africa',
    description: 'Colorful East African textile',
    colors: ['#FF1493', '#00CED1', '#FF8C00', '#9370DB', '#32CD32'],
    patterns: [
      {
        id: 'kitenge-tribal',
        name: 'Tribal Kitenge',
        description: 'Traditional tribal pattern',
        cssClass: 'pattern-kitenge-tribal',
      },
      {
        id: 'kitenge-modern',
        name: 'Modern Kitenge',
        description: 'Contemporary kitenge design',
        cssClass: 'pattern-kitenge-modern',
      },
      {
        id: 'kitenge-nature',
        name: 'Nature Kitenge',
        description: 'Nature-inspired pattern',
        cssClass: 'pattern-kitenge-nature',
      },
    ],
  },
};

// Pattern utility functions
export const getPatternById = (patternId) => {
  for (const patternType of Object.values(AFRICAN_PATTERNS)) {
    const pattern = patternType.patterns.find(p => p.id === patternId);
    if (pattern) {
      return {
        ...pattern,
        type: patternType.name,
        origin: patternType.origin,
        description: patternType.description,
        colors: patternType.colors,
      };
    }
  }
  return null;
};

export const getPatternsByType = (type) => {
  return AFRICAN_PATTERNS[type]?.patterns || [];
};

export const getAllPatterns = () => {
  const allPatterns = [];
  Object.values(AFRICAN_PATTERNS).forEach(patternType => {
    patternType.patterns.forEach(pattern => {
      allPatterns.push({
        ...pattern,
        type: patternType.name,
        origin: patternType.origin,
        description: patternType.description,
        colors: patternType.colors,
      });
    });
  });
  return allPatterns;
};

export const getRandomPattern = () => {
  const allPatterns = getAllPatterns();
  return allPatterns[Math.floor(Math.random() * allPatterns.length)];
};

export const getPatternColors = (patternId) => {
  const pattern = getPatternById(patternId);
  return pattern?.colors || [];
};

// Pattern CSS classes generator
export const generatePatternCSS = (patternId) => {
  const pattern = getPatternById(patternId);
  if (!pattern) return '';

  return `
    .${pattern.cssClass} {
      background-image: url('/images/patterns/${patternId}.svg');
      background-repeat: repeat;
      background-size: 200px 200px;
    }
  `;
};

// Pattern SVG generator (simplified)
export const generatePatternSVG = (patternType, patternId) => {
  const baseSVG = (content) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <pattern id="${patternId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          ${content}
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#${patternId})" />
    </svg>
  `;

  const patterns = {
    'kente-diamond': `
      <polygon points="20,5 35,20 20,35 5,20" fill="#FFD700" stroke="#FF6B35" stroke-width="1"/>
    `,
    'kente-stripes': `
      <rect x="0" y="0" width="40" height="10" fill="#FFD700"/>
      <rect x="0" y="10" width="40" height="10" fill="#FF6B35"/>
      <rect x="0" y="20" width="40" height="10" fill="#004E89"/>
      <rect x="0" y="30" width="40" height="10" fill="#A23B72"/>
    `,
    'ankara-geometric': `
      <circle cx="10" cy="10" r="8" fill="#E63946"/>
      <circle cx="30" cy="30" r="8" fill="#457B9D"/>
      <rect x="15" y="15" width="10" height="10" fill="#1D3557"/>
    `,
    'mud-lines': `
      <line x1="0" y1="10" x2="40" y2="10" stroke="#8B4513" stroke-width="2"/>
      <line x1="0" y1="20" x2="40" y2="20" stroke="#D2691E" stroke-width="2"/>
      <line x1="0" y1="30" x2="40" y2="30" stroke="#8B4513" stroke-width="2"/>
    `,
  };

  return baseSVG(patterns[patternId] || '');
};

// Pattern theme generator
export const generatePatternTheme = (patternId) => {
  const pattern = getPatternById(patternId);
  if (!pattern) return null;

  return {
    primary: pattern.colors[0],
    secondary: pattern.colors[1] || pattern.colors[0],
    accent: pattern.colors[2] || pattern.colors[0],
    background: '#FFFFFF',
    text: '#333333',
    pattern: pattern.cssClass,
  };
};

export default {
  AFRICAN_PATTERNS,
  getPatternById,
  getPatternsByType,
  getAllPatterns,
  getRandomPattern,
  getPatternColors,
  generatePatternCSS,
  generatePatternSVG,
  generatePatternTheme,
};
