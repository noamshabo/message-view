/**
 * פונקציות עזר ל-RTL (Right-to-Left)
 */

/**
 * מחזיר את כיוון המסמך
 */
export function getDocumentDirection(): 'rtl' | 'ltr' {
  return document.documentElement.dir as 'rtl' | 'ltr' || 'rtl';
}

/**
 * הופך ערך margin/padding ל-RTL
 * לדוגמה: "10px 20px 30px 40px" -> "10px 40px 30px 20px"
 */
export function flipSpacing(value: string): string {
  const parts = value.trim().split(/\s+/);
  
  if (parts.length === 4) {
    // top right bottom left -> top left bottom right
    return `${parts[0]} ${parts[3]} ${parts[2]} ${parts[1]}`;
  }
  
  if (parts.length === 2) {
    // vertical horizontal -> vertical horizontal (אותו דבר)
    return value;
  }
  
  return value;
}

/**
 * מחזיר את התכונה הנכונה (start/end) בהתאם לכיוון
 */
export function getLogicalProperty(property: 'start' | 'end'): 'right' | 'left' {
  const isRTL = getDocumentDirection() === 'rtl';
  
  if (property === 'start') {
    return isRTL ? 'right' : 'left';
  } else {
    return isRTL ? 'left' : 'right';
  }
}

/**
 * מחזיר סגנון inline עבור margin-inline-start
 */
export function marginInlineStart(value: string | number): React.CSSProperties {
  const val = typeof value === 'number' ? `${value}px` : value;
  return { marginInlineStart: val } as React.CSSProperties;
}

/**
 * מחזיר סגנון inline עבור margin-inline-end
 */
export function marginInlineEnd(value: string | number): React.CSSProperties {
  const val = typeof value === 'number' ? `${value}px` : value;
  return { marginInlineEnd: val } as React.CSSProperties;
}

/**
 * מחזיר סגנון inline עבור padding-inline-start
 */
export function paddingInlineStart(value: string | number): React.CSSProperties {
  const val = typeof value === 'number' ? `${value}px` : value;
  return { paddingInlineStart: val } as React.CSSProperties;
}

/**
 * מחזיר סגנון inline עבור padding-inline-end
 */
export function paddingInlineEnd(value: string | number): React.CSSProperties {
  const val = typeof value === 'number' ? `${value}px` : value;
  return { paddingInlineEnd: val } as React.CSSProperties;
}

