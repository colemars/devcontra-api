const handleSiteConfig = async (url, siteName) => {
  if (!url.includes("https")) return { error: "not a valid url" };
  if (siteName === "stackoverflow")
    return {
      root: "https://stackoverflow.com",
      urlParams: ["?tab=answers", "?tab=questions"],
      selectors: [".question-hyperlink", ".answer-hyperlink"]
    };

  return { error: "not a valid site" };
};

export default handleSiteConfig;
