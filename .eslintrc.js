module.exports = {
  extends: [
    // 其他 ESLint 配置
    'prettier', // 必须放在最后
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
