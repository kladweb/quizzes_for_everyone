export const handleCopy = async (currentLink: string, setCopied: (copied: boolean) => void) => {
  try {
    await navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
