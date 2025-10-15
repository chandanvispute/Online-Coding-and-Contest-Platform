/*
  # Create Test Cases and Submissions Schema

  1. New Tables
    - `test_cases`
      - `id` (uuid, primary key)
      - `problem_id` (integer, references problem)
      - `input` (text, test case input)
      - `expected_output` (text, expected result)
      - `is_sample` (boolean, whether visible to users)
      - `created_at` (timestamp)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `problem_id` (integer)
      - `code` (text, submitted code)
      - `language` (text, programming language)
      - `status` (text, pass/fail)
      - `score` (integer, percentage score)
      - `passed_tests` (integer, number of passed tests)
      - `total_tests` (integer, total number of tests)
      - `execution_time` (integer, milliseconds)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - test_cases: Public read access for authenticated users
    - submissions: Users can read own submissions and insert new ones
*/

CREATE TABLE IF NOT EXISTS test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id integer NOT NULL,
  input text NOT NULL,
  expected_output text NOT NULL,
  is_sample boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id integer NOT NULL,
  code text NOT NULL,
  language text NOT NULL,
  status text NOT NULL,
  score integer DEFAULT 0,
  passed_tests integer DEFAULT 0,
  total_tests integer DEFAULT 0,
  execution_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view test cases"
  ON test_cases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_test_cases_problem_id ON test_cases(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
