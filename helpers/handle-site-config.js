const handleSiteConfig = async (url, siteName) => {
  if (!url.includes("https")) return { urlProps: { error: "not a valid url" } };
  if (siteName === "stackoverflow")
    return {
      urlProps: {
        root: "https://stackoverflow.com",
        params: ["?tab=answers", "?tab=questions"],
        selectors: [".question-hyperlink", ".answer-hyperlink"]
      }
    };

  return { urlProps: { error: "not a valid site" } };
};

export default handleSiteConfig;
