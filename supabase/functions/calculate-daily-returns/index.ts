// Update the SQL function to only calculate returns for active investments
CREATE OR REPLACE FUNCTION public.calculate_daily_investment_returns()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update user balances based on active investments only
    UPDATE profiles p
    SET balance = balance + (
        SELECT COALESCE(SUM(amount * (daily_interest / 100)), 0)
        FROM investments i
        WHERE i.user_id = p.id
        AND i.status = 'active'
        AND i.end_date > NOW() -- Only include investments that haven't matured
    );

    -- Insert notification for users with active investments
    INSERT INTO notifications (user_id, title, message, type)
    SELECT DISTINCT
        i.user_id,
        'Daily Investment Return',
        'Your investment has generated returns for today',
        'investment'
    FROM investments i
    WHERE i.status = 'active'
    AND i.end_date > NOW(); -- Only notify for active investments that haven't matured
END;
$function$;

-- Update the check_and_update_investments function to handle matured investments
CREATE OR REPLACE FUNCTION public.update_completed_investments()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update status of matured investments
    UPDATE investments
    SET status = 'completed'
    WHERE status = 'active' 
    AND end_date <= NOW();

    -- Send notification to users whose investments have matured
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
        i.user_id,
        'Investment Matured',
        'Your investment plan has completed. You can now reinvest or withdraw your funds.',
        'investment_completed'
    FROM investments i
    WHERE i.status = 'completed'
    AND i.end_date::date = CURRENT_DATE;
END;
$function$;