# anime-data

Combines the [bangumi-data](https://github.com/bangumi-data/bangumi-data) and [anime-offline-database](https://github.com/manami-project/anime-offline-database) repositories and adds TypeScript type definitions for them.

This project provides a clean, merged, and type-safe dataset of anime information, ideal for developers building applications with anime data.

## Project Structure

Switch to the `release` branch to access the data files.

```text
.
├── data.d.ts               # TypeScript declaration file for the entire dataset
├── data.json               # All anime data in a single file
├── bangumi-data            # bangumi-data with type definitions
│   └── data.d.ts
├── season                  # Anime data organized by season
│   └── [year]              # Directory for each year
│       └── [season].json   # Data for a specific season (e.g., spring.json)
└── years                   # Anime data organized by release year (following bangumi-data structure)
    └── [year]              # Directory for each year
        └── [month].json    # Anime that started airing in this month
```

## How to Use

### Using Git

It is recommended to clone the `release` branch which contains the latest data.

```bash
git clone --depth 1 -b release https://github.com/empty-233/anime-data.git
```

### Direct Download

You can also download the data directly from the `release` branch on GitHub.

## Update Frequency

The data is automatically updated every Monday at 3:00 AM via GitHub Actions.