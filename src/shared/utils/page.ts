export const scrollToTop = (smooth = true) => window.scrollTo({top: 0, left: 0, behavior: smooth ? "smooth" : "instant"});

export const ARTICLES_PER_PAGE = 20;