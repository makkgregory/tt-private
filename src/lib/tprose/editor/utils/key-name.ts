const MAC =
  typeof navigator != 'undefined'
    ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
    : false;

export const normalizeKeyName = (name: string) => {
  const parts = name.split(/-(?!$)/);
  let result = parts[parts.length - 1];
  if (result == 'Space') result = ' ';
  let alt, ctrl, shift, meta;
  for (let i = 0; i < parts.length - 1; i++) {
    const mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod)) {
      meta = true;
    } else if (/^a(lt)?$/i.test(mod)) {
      alt = true;
    } else if (/^(c|ctrl|control)$/i.test(mod)) {
      ctrl = true;
    } else if (/^s(hift)?$/i.test(mod)) {
      shift = true;
    } else if (/^mod$/i.test(mod)) {
      if (MAC) meta = true;
      else ctrl = true;
    } else throw new Error('Unrecognized modifier name: ' + mod);
  }
  if (alt) {
    result = 'Alt-' + result;
  }
  if (ctrl) {
    result = 'Ctrl-' + result;
  }
  if (meta) {
    result = 'Meta-' + result;
  }
  if (shift) {
    result = 'Shift-' + result;
  }
  return result.toLowerCase();
};

export const resolveKeyName = (event: KeyboardEvent) => {
  const name = new Set<string>();
  if (event.shiftKey) {
    name.add('Shift');
  }
  if (event.metaKey) {
    name.add('Meta');
  }
  if (event.ctrlKey) {
    name.add('Ctrl');
  }
  if (event.altKey) {
    name.add('Alt');
  }
  name.add(event.key);
  return Array.from(name)
    .map((current) => current.toLowerCase())
    .join('-');
};
