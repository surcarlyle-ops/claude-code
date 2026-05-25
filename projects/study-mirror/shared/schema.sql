-- Study Mirror Database Schema
-- Version 1.0

-- ======================
-- 1. Users and Authentication
-- ======================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 2. Mentor-Student Relationships
-- ======================

CREATE TABLE mentor_relationships (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'ended')),
    sharing_level VARCHAR(20) DEFAULT 'progress' CHECK (sharing_level IN ('basic', 'progress', 'detailed', 'full')),
    student_notes TEXT,
    mentor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mentor_id, student_id)
);

-- ======================
-- 3. Learning Goals (Tree Structure)
-- ======================

CREATE TABLE learning_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES learning_goals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'other', -- e.g., 'programming', 'math', 'language'
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=最高, 5=最低
    estimated_hours DECIMAL(5,1),
    actual_hours DECIMAL(5,1) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'paused', 'abandoned')),
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    is_public BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    deadline DATE,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For hierarchical queries (closure table or materialized path)
CREATE TABLE goal_hierarchy (
    ancestor_id INTEGER NOT NULL REFERENCES learning_goals(id) ON DELETE CASCADE,
    descendant_id INTEGER NOT NULL REFERENCES learning_goals(id) ON DELETE CASCADE,
    depth INTEGER NOT NULL,
    PRIMARY KEY (ancestor_id, descendant_id)
);

-- ======================
-- 4. Daily Progress Tracking
-- ======================

CREATE TABLE daily_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id INTEGER REFERENCES learning_goals(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL, -- 今天学了什么
    hours_spent DECIMAL(4,2) DEFAULT 0,
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    productivity_rating INTEGER CHECK (productivity_rating BETWEEN 1 AND 10),
    tags TEXT[], -- e.g., {'focus', 'understanding', 'practice'}
    attachments JSONB, -- URLs to images, documents, etc.
    is_shareable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, goal_id)
);

-- ======================
-- 5. Study Sessions (Focus Timer)
-- ======================

CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id INTEGER REFERENCES learning_goals(id) ON DELETE SET NULL,
    session_type VARCHAR(20) DEFAULT 'pomodoro' CHECK (session_type IN ('pomodoro', 'deep_work', 'review', 'practice')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    interruption_count INTEGER DEFAULT 0,
    focus_score INTEGER CHECK (focus_score BETWEEN 1 AND 100),
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 6. Health & Well-being Tracking
-- ======================

CREATE TABLE health_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    coffee_cups INTEGER DEFAULT 0,
    sleep_hours DECIMAL(3,1),
    exercise_minutes INTEGER,
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- ======================
-- 7. AI Analysis & Recommendations
-- ======================

CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_id INTEGER REFERENCES learning_goals(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'next_steps', 'study_schedule', 'resource_suggestion'
    content JSONB NOT NULL, -- AI生成的推荐内容
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    accepted BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 8. Mentor Reports & Sharing
-- ======================

CREATE TABLE mentor_reports (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    report_type VARCHAR(20) DEFAULT 'weekly' CHECK (report_type IN ('weekly', 'biweekly', 'monthly')),
    generated_by VARCHAR(20) DEFAULT 'manual' CHECK (generated_by IN ('manual', 'ai', 'auto')),
    content JSONB NOT NULL, -- 结构化报告数据
    summary_text TEXT, -- AI生成的文本摘要
    viewed_by_mentor BOOLEAN DEFAULT FALSE,
    mentor_feedback TEXT,
    shared_url VARCHAR(255) UNIQUE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 9. Notifications & Reminders
-- ======================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- ======================
-- Indexes for Performance
-- ======================

CREATE INDEX idx_learning_goals_user_id ON learning_goals(user_id);
CREATE INDEX idx_learning_goals_parent_id ON learning_goals(parent_id);
CREATE INDEX idx_learning_goals_status ON learning_goals(status);
CREATE INDEX idx_daily_progress_user_date ON daily_progress(user_id, date DESC);
CREATE INDEX idx_study_sessions_user_time ON study_sessions(user_id, start_time DESC);
CREATE INDEX idx_mentor_relationships_mentor ON mentor_relationships(mentor_id);
CREATE INDEX idx_mentor_relationships_student ON mentor_relationships(student_id);
CREATE INDEX idx_goal_hierarchy_descendant ON goal_hierarchy(descendant_id);

-- ======================
-- Functions and Triggers
-- ======================

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON learning_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentor_relationships_updated_at BEFORE UPDATE ON mentor_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate goal progress
CREATE OR REPLACE FUNCTION calculate_goal_progress(goal_id INTEGER)
RETURNS DECIMAL AS $$
DECLARE
    total_children INTEGER;
    completed_children INTEGER;
    progress DECIMAL;
BEGIN
    -- Count children
    SELECT COUNT(*) INTO total_children
    FROM learning_goals
    WHERE parent_id = goal_id;

    -- Count completed children
    SELECT COUNT(*) INTO completed_children
    FROM learning_goals
    WHERE parent_id = goal_id AND status = 'completed';

    IF total_children = 0 THEN
        -- Leaf goal, check own status
        SELECT CASE
            WHEN status = 'completed' THEN 100.0
            WHEN status = 'in_progress' THEN COALESCE((actual_hours / NULLIF(estimated_hours, 0)) * 100, 0)
            ELSE 0.0
        END INTO progress
        FROM learning_goals
        WHERE id = goal_id;
    ELSE
        -- Parent goal, average of children
        progress := (completed_children::DECIMAL / total_children) * 100;
    END IF;

    RETURN ROUND(COALESCE(progress, 0), 2);
END;
$$ LANGUAGE plpgsql;