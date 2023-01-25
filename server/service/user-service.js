const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, loginTime) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest('User with this email already exists')
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const status = 'active'
        const user = await UserModel.create({email, password: hashPassword, activationLink, loginTime, status})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        user.status = 'active';
        await user.save()

        return {
            ...tokens,
            user: userDto
        }
    }
    async activate (activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Wrong activation link')
        }
        user.isActivated = true;
        await user.save();
    } 

    async login(email, password, loginTime) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('User was not found')
        }
        if(user.status === 'blocked') {
            throw ApiError.BadRequest('This user is blocked')
        }
        const isPassEquals = await bcrypt.compare(password,user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest('Wrong password')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        user.loginTime = loginTime;
        await user.save()

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers () {
        const  users = await UserModel.find();
        return users;
    }

    async blockUser(email) {
        const user = await UserModel.findOne({email})
        user.status = 'blocked';
        await user.save()
    }

    async unblockUser(email) {
        const user = await UserModel.findOne({email})
        user.status = 'active';
        await user.save()
    }

    async deleteUser(email) {
        const user = await UserModel.findOneAndDelete({email})
    }
}

module.exports = new UserService();