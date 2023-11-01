/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-02 16:53:23
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-01 13:10:09
 * @Description: 
 */
"use strict";
const { getObject, getSteedosConfig } = require("@steedos/objectql")
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
    name: 'users',
    namespace: "steedos",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        /**
         * @api {call} validateUsername 验证用户名格式
         * @apiName validateUsername
         * @apiGroup users.service.js
         * @apiParam {String} username 用户名
         * @apiParam {String} userId 用户ID
         */
        validateUsername: {
            params: {
                username: { type: "string" },
                userId: { type: "string" },
            },
            async handler(ctx) {
                this.broker.logger.info('[service][users]===>', 'validateUsername', ctx.params)
                return await this.validateUsername(ctx.params.username, ctx.params.userId)
            }
        },
        clearLoginTokens: {
            rest: {
                method: "GET",
                fullPath: "/api/users/:userId/clear_login_tokens",
            },
            params: {
                userId: { type: "string" }
            },
            async handler(ctx) {
                const { user, userAgent, clientIp } = ctx.meta;
                const { userId } = ctx.params;
                if(!user.is_space_admin){
                    return '非管理员无权操作'
                }
                if(!userId){
                    return "缺少参数"
                }
                const dbUser = await getObject('users').findOne(userId)
                if(dbUser){
                    // 1 清空 登录tokens
                    await getObject('users').update(userId, {"services.resume.loginTokens": []})
                    // 2 设置 sessions 无效
                    await getObject('sessions').updateMany(["userId", "=", userId], {"valid": false}) 
                    // 3 记录操作日志
                    await getObject('operation_logs').insert({
                        name: '注销所有登录',
                        type: 'clear_login_tokens',
                        remote_user: user.userId,
                        remote_addr: clientIp,
                        http_user_agent: userAgent,
                        object: 'users',
                        status: 'success',
                        create: new Date(),
                        space: user.spaceId,
                        message: `[系统管理员]清理用户[${dbUser.name}]的登录tokens`,
                        data: JSON.stringify(ctx.params),
                        related_to: {
                          o: "users",
                          ids: [dbUser._id]
                        }
                    })
                }
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /**
         * 验证用户名格式
         * @param {*} username 
         * @param {*} userId 
         */
        async validateUsername(username, userId) {
            const userObj = getObject('users')
            var nameValidation, user;
            user = (await userObj.find({
                filters: [
                    ['username', '=', username],
                    ['_id', '!=', userId]
                ]
            }))[0];
            if (user) {
                throw new Error('username-unavailable', 'username-unavailable');
            }
            const steedosConfig = getSteedosConfig();
            const accountsConfig = steedosConfig.public.accounts || {};
            if (!accountsConfig.is_username_skip_minrequiredlength) {
                if (username.length < 6) {
                    throw new Error('username-minrequiredlength', "username-minrequiredlength");
                }
            }
            try {
                if (accountsConfig.UTF8_Names_Validation) {
                    nameValidation = new RegExp('^' + accountsConfig.UTF8_Names_Validation + '$');
                } else {
                    nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
                }
            } catch (error) {
                nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
            }
            if (!nameValidation.test(username)) {
                throw new Error('username-invalid', "username-invalid");
            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {
        this.broker.logger.info('[service][users]===>', 'started')
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
