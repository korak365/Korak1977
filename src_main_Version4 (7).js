import { Actor } from "apify";
import { CheerioCrawler, Dataset } from "crawlee";
import dayjs from "dayjs";

// Initialize the Actor
await Actor.init();

const {
    jobBoardUrls = [],
    daysThreshold = 90,
    dateSelector = ".job-date, .job-posted-date, .job-age",
} = (await Actor.getInput()) ?? {};

const crawler = new CheerioCrawler({
    async requestHandler({ request, $, log }) {
        log.info(`Crawling: ${request.url}`);

        const jobListings = [];
        const currentDate = dayjs();

        // Scrape each job listing on the page
        $(".job-card, .job-listing, .job-item").each((_, el) => {
            const listing = $(el);
            const title = listing.find(".job-title, .title").text().trim();
            const company = listing.find(".company, .job-company").text().trim();
            const location = listing.find(".location, .job-location").text().trim();
            const dateField = listing.find(dateSelector).text().trim();

            // Parse the date field and calculate the age of the listing
            const listingDate = dayjs(dateField, ["MMM D, YYYY", "YYYY-MM-DD", "MMM D"]); // Adjust based on date formats
            const daysActive = currentDate.diff(listingDate, "days");

            // Flag listings active for more than the threshold
            const isGhostListing = daysActive > daysThreshold;

            jobListings.push({
                title,
                company,
                location,
                dateField,
                daysActive,
                isGhostListing,
                url: request.url,
            });
        });

        log.info(`Found ${jobListings.length} job listings on ${request.url}`);
        await Dataset.pushData(jobListings);
    },
});

const sources = jobBoardUrls.map((url) => ({ url }));
await crawler.run(sources);

// Gracefully exit the Actor
await Actor.exit();