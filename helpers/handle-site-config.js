const handleSiteConfig = async (url, siteName) => {
  console.log(siteName);
  console.log(url);
  if (!url.includes("https")) return { error: "not a valid url" };
  console.log("past first validate");
  if (siteName === "stackoverflow") {
    console.log("past second validate");
    return {
      root: "https://stackoverflow.com",
      urlParams: ["?tab=answers", "?tab=questions"],
      selectors: [".question-hyperlink", ".answer-hyperlink"]
    };
  }
  return { error: "not a valid url" };
};

export default handleSiteConfig;
