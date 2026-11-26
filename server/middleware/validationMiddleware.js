const { body, validationResult } = require("express-validator");

exports.validateUserRegistration = [
    body("name").notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/\d/)
        .withMessage("Password must contain at least one digit."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errorMessage: errors.array()[0].msg });
        }
        next();
    }
];

exports.validateProduct = [
    body("name").notEmpty().withMessage("Name is required."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("rating").optional({ checkFalsy: true }).isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errorMessage: errors.array()[0].msg });
        }
        next();
    }
];
