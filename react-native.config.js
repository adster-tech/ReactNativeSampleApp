module.exports = {
  dependencies: {
    'razorpay-ads-react-native': {
      platforms: {
        android: {
          packageImportPath:
            'import com.razorpayreactnative.RazorpayAdPackage;',
          packageInstance: 'new RazorpayAdPackage()',
        },
      },
    },
  },
};
