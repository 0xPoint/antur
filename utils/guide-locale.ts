// Guides currently have Russian pages only. `path` is locale-stripped and normalized.
export const isRussianOnlyGuidePath = (path: string) => path.startsWith('/guides/')
