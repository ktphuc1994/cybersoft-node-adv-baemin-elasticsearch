const parseObjectToParamString = (
  obj?: Record<string, string | number | undefined>
): string => {
  if (!obj) return '';

  Object.keys(obj).forEach((key) => {
    if (!obj[key] && obj[key] !== 0) delete obj[key];
  });

  return new URLSearchParams(obj as Record<string, string>).toString();
};

export { parseObjectToParamString };
