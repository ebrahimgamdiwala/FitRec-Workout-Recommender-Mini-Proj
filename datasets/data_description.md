# 🏋️ Fitness Workout & Program Dataset
---
## About This Dataset

This comprehensive fitness dataset contains over 600,000 structured workout routines and exercise entries scraped from fitness planning platform data. The dataset includes both detailed exercise-level data and program-level summaries, making it ideal for building recommendation systems, analyzing workout patterns, and understanding fitness program structures.

## 📊 Dataset Overview

The dataset consists of two complementary CSV files:

* **`fitness_exercises.csv` (Main Dataset):** 605,033 individual exercise entries with detailed workout information.
* **`program_summary.csv` (Program Summary):** 2,598 unique fitness programs with aggregated metadata.

## 🎯 Potential Use Cases

* Building workout recommendation systems
* Analyzing fitness program effectiveness and popularity
* Understanding exercise patterns and program structures
* Creating personalized workout generators
* Fitness app development and research
* Program-level analysis and clustering

## 🔑 Data Dictionary

### `fitness_exercises.csv` (Main Dataset)

This file contains 605,000+ individual exercise entries.

| Column | Description |
| :--- | :--- |
| `title` | Workout/program name |
| `description` | Detailed workout description |
| `level` | Fitness level (beginner/intermediate/advanced) |
| `goal` | Primary fitness objective |
| `equipment` | Required equipment type |
| `program_length` | Duration in weeks |
| `time_per_workout` | Duration per session (minutes) |
| `week` | Position in program structure (week number) |
| `day` | Position in program structure (day number) |
| `exercise_name` | Specific exercise name |
| `sets` / `reps` | Exercise volume parameters. **Note:** Negative values indicate time in seconds. |
| `intensity` | Exercise intensity level |

### `program_summary.csv` (Program Summary)

This file provides high-level metadata for 2,598 unique programs.

| Column | Description |
| :--- | :--- |
| `title` | Program name |
| `description` | Program overview and objectives |
| `level` | Target fitness level |
| `goal` | Primary fitness goal |
| `equipment` | Required equipment |
| `program_length` | Total program duration (weeks) |
| `time_per_workout` | Average workout duration (minutes) |
| `total_exercises` | Total number of exercises in the program |
| `created` | Program creation timestamp |
| `last_edit` | Program last modification timestamp |

## 🔗 Data Relationship

The `program_summary.csv` file provides aggregated views of the detailed exercise data found in `fitness_exercises.csv`. This allows for both micro-level exercise analysis (from the main file) and macro-level program insights (from the summary file).

## 🔧 Technical Details

* **Format:** CSV files
* **Combined Size:** ~300MB+
* **Data Quality:** Minimal missing values (<1% for most columns)
* **Source:** Fitness platform data (with attribution)

## ⚖️ Important Notes

> * Data collected from publicly available fitness planning platform.
> * Cleaned and structured for research/educational use.
> * Please respect the original platform's terms of service.
> * Consider this for non-commercial research and educational purposes.
## 📥 Download Link 
https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset/data