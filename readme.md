users:  
- id
- email
- username
- password
- role
- cohort
- created_at

posts:  
- id
- question
- answer
- iq_points
- track
- category
- user_id
- created_at

replies:  
- id
- reply
- iq_points
- user_id
- post_id
- created_at

notes:  
- structure of tables?
- upvote functionality, updating in real time?, how it works on the back end, will have only upvotes and no downvotes
- career coach role, special code on sign in?, checkbox on form?
- recommended questions, random question, search, filter by cohort, trending/popular, order by recent by default
- have to set to local state in order to update real time, once refresh page, all data will sync
- urls with usernames and post questions instead of ids?
- can view questions without logging in, but once try to post question, prompted to sign up/sign in?

stretch:  
- reply to reply functionality
- @ functionality