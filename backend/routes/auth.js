router.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create and save the new user
    const user = new User({ username, email, password });
    await user.save();

    // Optionally, create a JWT token
    const token = 'some_generated_token'; // Replace with actual token generation logic

    res.status(201).json({ message: 'User registered successfully.', token });
  } catch (err) {
    console.error('Error registering user:', err); // Log the error for debugging
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});
