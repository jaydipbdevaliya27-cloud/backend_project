import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiErrors.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;
    console.log(fullname);

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fieldsa are required")
        return;
    }

    //User Existence validation
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new apiErrors(409, "User is already Existed");
                return;
    }


    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // Add an extra '?' before [0] to prevent crashes if coverImage is empty
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;


    console.log(avatarLocalPath);
    if (!avatarLocalPath) {
        throw new apiErrors(400, "(localPathError) Avatar file is required")
                return;
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new apiErrors(400, "avatar Avatar file is required")
                return;
    }
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken ")

    if (!createdUser) {
        throw new apiErrors(500, "something went wrong while registering the user")
                return;
    }


    return res.status(201).json(
        new apiResponse(201, createdUser, "user registered successfully")
    )
})

export { registerUser }
