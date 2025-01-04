import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const SignUpForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: user?.id,
          username,
          phone_number: phoneNumber,
          avatar_url: null,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      })

      navigate("/dashboard")
    } catch (error) {
      console.error('Error creating profile:', error)
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white rounded-md p-2">Sign Up</button>
    </form>
  )
}

export default SignUpForm
