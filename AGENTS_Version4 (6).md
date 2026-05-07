# Ghost Listing Identifier Scraper

This Actor identifies "ghost listings" on job boards—job posts that have been active for more than a specified number of days (e.g., 90 days) without hiring or updates.

## Features
- Scrapes job boards to find job listings' publication dates or "last updated" timestamps.
- Flags job posts that exceed the threshold for days active.
- Outputs structured data, including the job title, company, location, and whether the listing is stale.

## Input Configuration
- **jobBoardUrls**: List of URLs to scrape.
- **daysThreshold**: Number of days to define a job post as a "ghost listing."
- **dateSelector**: CSS selector for finding the date or timestamp in the HTML.

## Output Schema
- `title`: Job title.
- `company`: Hiring company.
- `location`: Job location.
- `dateField`: Job publication or update date.
- `daysActive`: Days the job post has been active.
- `isGhostListing`: Boolean flag indicating "ghost" status.
- `url`: URL of the job post.

## Example Use Cases
- Identify stale job posts for deletion or updating by job board managers.
- Alert job seekers about potentially inactive or stale listings.
- Help recruiters prioritize fresh job postings.

## Example Input
```json
{
    "jobBoardUrls": ["https://www.indeed.com/jobs?q=software+developer"],
    "daysThreshold": 90,
    "dateSelector": ".job-date"
}