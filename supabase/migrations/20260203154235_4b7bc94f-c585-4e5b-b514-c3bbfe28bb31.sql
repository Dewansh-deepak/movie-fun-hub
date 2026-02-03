-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'creator', 'user');

-- Create user roles table (for admin access)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles table for users/creators
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    upi_id TEXT,
    phone TEXT,
    coins_balance INTEGER NOT NULL DEFAULT 0,
    total_earnings_paise INTEGER NOT NULL DEFAULT 0,
    is_creator BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Video categories enum
CREATE TYPE public.video_category AS ENUM ('drama', 'horror', 'comedy', 'romance');

-- Videos table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cloudinary_public_id TEXT NOT NULL,
    cloudinary_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds <= 30),
    category video_category NOT NULL,
    views_count INTEGER NOT NULL DEFAULT 0,
    likes_count INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Video views tracking (for coin calculation)
CREATE TABLE public.video_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    viewer_ip TEXT,
    watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    coins_awarded BOOLEAN NOT NULL DEFAULT false
);

-- Coin transactions table
CREATE TABLE public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'payout', 'bonus')),
    description TEXT,
    video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout requests table
CREATE TABLE public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    coins_amount INTEGER NOT NULL CHECK (coins_amount >= 5000),
    paise_amount INTEGER NOT NULL,
    upi_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Video likes table
CREATE TABLE public.video_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (video_id, profile_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for videos
CREATE POLICY "Published videos are viewable by everyone" ON public.videos FOR SELECT USING (is_published = true);
CREATE POLICY "Creators can insert videos" ON public.videos FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = creator_id AND user_id = auth.uid() AND is_creator = true)
);
CREATE POLICY "Creators can update own videos" ON public.videos FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = creator_id AND user_id = auth.uid())
);
CREATE POLICY "Creators can delete own videos" ON public.videos FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = creator_id AND user_id = auth.uid())
);

-- RLS Policies for video_views
CREATE POLICY "Anyone can insert views" ON public.video_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Creators can view their video stats" ON public.video_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM videos v JOIN profiles p ON v.creator_id = p.id WHERE v.id = video_id AND p.user_id = auth.uid())
);

-- RLS Policies for coin_transactions
CREATE POLICY "Users can view own transactions" ON public.coin_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);

-- RLS Policies for payout_requests
CREATE POLICY "Users can view own payouts" ON public.payout_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);
CREATE POLICY "Users can request payouts" ON public.payout_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);

-- RLS Policies for video_likes
CREATE POLICY "Anyone can view likes" ON public.video_likes FOR SELECT USING (true);
CREATE POLICY "Users can like videos" ON public.video_likes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);
CREATE POLICY "Users can unlike videos" ON public.video_likes FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);

-- RLS for user_roles (only admins can manage)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to award coins (10 views = 1 coin)
CREATE OR REPLACE FUNCTION public.process_view_coins()
RETURNS TRIGGER AS $$
DECLARE
    v_creator_id UUID;
    v_view_count INTEGER;
BEGIN
    -- Get creator id
    SELECT creator_id INTO v_creator_id FROM videos WHERE id = NEW.video_id;
    
    -- Count uncredited views for this video
    SELECT COUNT(*) INTO v_view_count 
    FROM video_views 
    WHERE video_id = NEW.video_id AND coins_awarded = false;
    
    -- Award 1 coin per 10 views
    IF v_view_count >= 10 THEN
        -- Update coins balance
        UPDATE profiles SET coins_balance = coins_balance + 1 WHERE id = v_creator_id;
        
        -- Mark views as credited
        UPDATE video_views SET coins_awarded = true 
        WHERE video_id = NEW.video_id AND coins_awarded = false;
        
        -- Log transaction
        INSERT INTO coin_transactions (profile_id, amount, transaction_type, description, video_id)
        VALUES (v_creator_id, 1, 'earned', '10 views earned', NEW.video_id);
    END IF;
    
    -- Update video view count
    UPDATE videos SET views_count = views_count + 1 WHERE id = NEW.video_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_video_view
    AFTER INSERT ON public.video_views
    FOR EACH ROW EXECUTE FUNCTION public.process_view_coins();