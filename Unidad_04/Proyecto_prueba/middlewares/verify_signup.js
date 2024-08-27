import usuario from '../components/usuario/model'

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const usuario = await usuario.findOne({username: req.body.username})
    if (usuario) 
        return res.status(400).json({message: 'The user already exists.'})

    const email = await usuario.findOne({email: req.body.email})
    if (email)
        return res.status(400).json({message: 'The email already exists.'})
    
    next()
}

export const checkExistingUser = async (req, res, next) => {
    try {
        const userFound = await usuario.findOne({ username: req.body.username });
        if (userFound)
            return res.status(400).json({ message: "The user already exists" });

        const email = await empleado.findOne({ email: req.body.email });
        if (email)
            return res.status(400).json({ message: "The email already exists" });

        next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
