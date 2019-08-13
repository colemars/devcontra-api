const handleSiteConfig = async (url, siteName) => {
  if (!url.includes("https")) return { error: "not a valid url" };
  if (siteName === "stack")
    return {
      root: "https://stackoverflow.com",
      urlParams: ["?tab=answers", "?tab=questions"],
      selectors: [".question-hyperlink", ".answer-hyperlink"]
    };

  return { error: "not a valid url" };
};

export default handleSiteConfig;
