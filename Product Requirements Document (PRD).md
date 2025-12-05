Product Requirements Document (PRD)
Product Name: Motiv
Version: 1.0 (MVP)
Owner: TBD
Last Updated: Today
1. Product Overview
Motiv is a social, interactive goal-tracking app where users can get inspired by others, join shared goals, and take action by participating in “Movements.”
Motiv blends the fun, viral nature of a social feed with structured goal tracking, accountability, and (eventually) paid mentorship from creators.
Core Concept:
Inspiration → Action → Accountability → Community → Momentum.
2. Problem Statement
People want to improve their lives but:
struggle with consistency
lack accountability
feel isolated in their goals
are overwhelmed by starting from scratch
get inspired by social media but rarely act on it
Existing apps are either:
too solitary (habit trackers, to-do lists)
too high friction (Notion systems)
not actionable (inspirational content without next steps)
Motiv solves this by making goals social, easy to start, and fun to maintain.
3. Goals & KPIs
Primary Goals
Increase user goal completion rates through social accountability
Create a community-driven platform that encourages recurring engagement
Enable creators/leaders to build and monetize goal-based movements
Success Metrics (V1)
DAU/MAU target: 35–40%
Avg sessions/day: 2.0+
First-week retention: 45%+
% of new users who join a movement: 40%
% of users who post at least once/week: 25%
4. Target Users
Primary Users
Ages 18–35
Interested in self-improvement, fitness, productivity
Spend time on TikTok/IG consuming challenge content
Want motivation + accountability
Want simple, fast goal systems
Secondary Users (Creators)
Fitness coaches
Productivity experts
Influencers
Lifestyle creators
Niche coaches (study habits, reading, finance, etc.)
Creators want:
to build a community
to grow Movements
to monetize mentorship
5. Product Pillars
1. Inspiration
A feed of goals, templates, and movements created by other users.
2. Action
Tap a goal → Join or Duplicate it in one tap.
3. Accountability
Shared progress updates inside Movement Hubs.
4. Community
Movements create micro-communities around shared goals.
5. Monetization
Creators can offer paid mentorship tiers.
6. Core Features (MVP)
6.1 Inspiration Feed
A scrollable feed of:
User goals
New movements
Progress updates
Featured templates
Popular challenges
Requirements:
Infinite scroll
Like, comment, save
“Join Movement” button
“Duplicate Goal” button
Filter: All / Trending / New / Templates
6.2 Create Goal
User can create a goal with:
Goal name
Description (optional)
Category (fitness, study, finance, wellness, etc.)
Duration (7, 14, 30, 60, 90 days)
Make this a movement? (toggle)
6.3 Movements
A Movement is a shared goal users join together.
Movement Page Includes:
Title & description
Progress bar (showing collective progress)
Member list
Daily/weekly prompts
Movement feed (only for participants)
Post update: text, photo, or video
Streak tracker
Required Actions:
Join / Leave Movement
Post progress update
React/comment
View member activity
6.4 User Profile
Includes:
Username, photo
Bio
My Goals
Movements I’ve joined
Completed goals
Stats (streaks, days active, goals completed)
6.5 Notifications
Triggered by:
Movement updates
Likes/comments
Streak milestones
New followers
Creator updates (if subscribed)
7. Premium / Paid Features (Phase 2+)
Not required for MVP, but crucial for future revenue.
7.1 Creator Mentorship Tiers
Creators can set:
Monthly subscription
Challenge-based fee (e.g., $19 for 30 days)
Benefits:
Direct DM
Priority response
Weekly check-ins
Premium guides/templates
Accountability pods
Platform Revenue:
20% fee
7.2 Premium User Upgrade
Includes:
More goal analytics
AI coach (weekly reports)
Premium templates
Streak protection
Custom themes
8. User Journeys
1. New User → Engaged User
User downloads Motiv
Onboarding: choose goal categories
Land on Inspiration Feed
Sees a movement → taps “Join”
Posts first update
Receives first notification → comes back
Joins more movements → builds streak
Becomes recurring user
2. Creator → Mentor
Creator makes movement
Gets 20+ members
Toggles “Enable Mentorship Tier”
Sets monthly price
Premium members join
Creator posts premium-only updates
Platform pays creator monthly
9. Non-Goals (Not in MVP)
Advanced analytics
AI coaching
Paid mentorship tiers
Video editing tools
In-app calls or video chat
Desktop app
(These come in later phases.)
10. Risks & Mitigation
Risk 1: Users may join movements but not post.
Solution:
Daily prompts
Streaks
Low-friction posting
Risk 2: Feed becomes noisy or low quality.
Solution:
Basic recommendation engine
Trending algorithm
Featuring high-quality goals
Risk 3: Creator adoption
Solution:
Incentives for early creators
Creator dashboard
Easy onboarding for starting movements
11. MVP Engineering Scope
Frontend
iOS or cross-platform (React Native)
5 screens:
Feed
Movement
Create Goal
My Goals
Profile
Backend
Auth (email, Apple, Google)
Firestore or Supabase for realtime feed + movement activity
Basic feed ranking
Notifications via Firebase
Analytics
Mixpanel or Amplitude basic event tracking
12. Launch Plan
Beta (100–500 users)
Recruit early creators
Encourage daily Movements & challenges
Collect behavior & engagement metrics
Public v1
Launch with 30–50 high-quality Movements
Social push: TikTok, Instagram
Referral incentives