-- Supabase Migration Script for northsecure_bank
-- Version: 1
-- Description: Initial schema setup for migrating from SQLite to Supabase (PostgreSQL).

-- --- EXTENSIONS ---
-- Enable pgcrypto for UUID generation if not already enabled.
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "public";

-- --- TABLE CREATION ---

-- 1. CUSTOMER TABLE
-- This table stores public user profile information. It is linked to Supabase's built-in auth.users table.
CREATE TABLE public.customer (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    address_line_1 VARCHAR(100),
    address_line_2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    account_tier VARCHAR(20) DEFAULT 'standard' NOT NULL,
    account_number VARCHAR(10) UNIQUE NOT NULL,
    avatar_url VARCHAR(100) DEFAULT 'default.png',
    date_joined TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comments on the customer table
COMMENT ON TABLE public.customer IS 'User profile information, linked to Supabase auth.';
COMMENT ON COLUMN public.customer.id IS 'Links to auth.users.id. Primary key.';
COMMENT ON COLUMN public.customer.is_admin IS 'Indicates if the user has administrative privileges.';

-- 2. ACCOUNT TABLE
-- Stores bank accounts associated with a customer.
CREATE TABLE public.account (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    account_type VARCHAR(50) NOT NULL,
    balance NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comments on the account table
COMMENT ON TABLE public.account IS 'Bank accounts for each customer.';
COMMENT ON COLUMN public.account.balance IS 'Financial data stored as NUMERIC for precision.';

-- 3. TRANSACTION TABLE
-- Logs all financial transactions for customers.
CREATE TABLE public.transaction (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
    type VARCHAR(20) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    notes VARCHAR(200),
    status VARCHAR(20) DEFAULT 'completed' NOT NULL,
    category VARCHAR(50) DEFAULT 'Uncategorized',
    is_read BOOLEAN DEFAULT FALSE NOT NULL
);

-- Comments on the transaction table
COMMENT ON TABLE public.transaction IS 'Records all financial transactions for a customer.';

-- 4. CHAT SESSION TABLE
-- Manages chat sessions between customers and admins.
CREATE TABLE public.chatsession (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES public.customer(id) ON DELETE SET NULL, -- Agent is also a customer
    start_time TIMESTAMPTZ DEFAULT now() NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL -- e.g., 'active', 'closed'
);

-- Comments on the chatsession table
COMMENT ON TABLE public.chatsession IS 'Represents a support chat session.';

-- 5. CHAT MESSAGE TABLE
-- Stores individual messages within a chat session.
CREATE TABLE public.chatmessage (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES public.chatsession(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comments on the chatmessage table
COMMENT ON TABLE public.chatmessage IS 'Individual messages within a chat session.';

-- --- ROW-LEVEL SECURITY (RLS) ---
-- IMPORTANT: RLS ensures that users can only access their own data.

-- Enable RLS for all relevant tables
ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatsession ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatmessage ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- CUSTOMER Table Policies
-- Users can see their own profile.
CREATE POLICY "Allow individual read access on customer"
ON public.customer FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile.
CREATE POLICY "Allow individual update access on customer"
ON public.customer FOR UPDATE
USING (auth.uid() = id);

-- Admins can access all customer profiles.
CREATE POLICY "Allow admin full access on customer"
ON public.customer FOR ALL
USING (EXISTS (SELECT 1 FROM public.customer WHERE id = auth.uid() AND is_admin = TRUE));

-- ACCOUNT Table Policies
-- Users can view their own accounts.
CREATE POLICY "Allow individual read access on account"
ON public.account FOR SELECT
USING (auth.uid() = customer_id);

-- Admins can view all accounts.
CREATE POLICY "Allow admin read access on account"
ON public.account FOR SELECT
USING (EXISTS (SELECT 1 FROM public.customer WHERE id = auth.uid() AND is_admin = TRUE));

-- TRANSACTION Table Policies
-- Users can view their own transactions.
CREATE POLICY "Allow individual read access on transaction"
ON public.transaction FOR SELECT
USING (auth.uid() = customer_id);

-- Admins can view all transactions.
CREATE POLICY "Allow admin read access on transaction"
ON public.transaction FOR SELECT
USING (EXISTS (SELECT 1 FROM public.customer WHERE id = auth.uid() AND is_admin = TRUE));

-- CHATSESSION Table Policies
-- Users can access their own chat sessions.
CREATE POLICY "Allow individual access on chatsession"
ON public.chatsession FOR ALL
USING (auth.uid() = customer_id);

-- Admins can access all chat sessions.
CREATE POLICY "Allow admin full access on chatsession"
ON public.chatsession FOR ALL
USING (EXISTS (SELECT 1 FROM public.customer WHERE id = auth.uid() AND is_admin = TRUE));

-- CHATMESSAGE Table Policies
-- Users can access messages in their own chat sessions.
CREATE POLICY "Allow access to messages in own session"
ON public.chatmessage FOR ALL
USING (
    sender_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.chatsession
        WHERE public.chatsession.id = session_id AND public.chatsession.customer_id = auth.uid()
    )
);

-- Admins can access all chat messages.
CREATE POLICY "Allow admin full access on chatmessage"
ON public.chatmessage FOR ALL
USING (EXISTS (SELECT 1 FROM public.customer WHERE id = auth.uid() AND is_admin = TRUE));


-- --- HELPER FUNCTION for new user setup ---
-- This function creates a corresponding `customer` profile when a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer (id, username, account_number)
  VALUES (
    new.id,
    new.email, -- Default username to email, can be changed by user later
    substring(replace(gen_random_uuid()::text, '-', ''), 1, 10) -- Generate a random 10-digit account number
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- TRIGGER for new user ---
-- This trigger calls the function whenever a new user is added to `auth.users`.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- --- END OF SCRIPT ---
-- Final check: Ensure all tables and policies are created before applying data.
-- Next step: Use the migration_guide.txt for data migration instructions.