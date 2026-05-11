import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_it.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('it'),
  ];

  /// No description provided for @commonLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get commonLoading;

  /// No description provided for @commonError.
  ///
  /// In en, this message translates to:
  /// **'Error'**
  String get commonError;

  /// No description provided for @commonLogout.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get commonLogout;

  /// No description provided for @commonWatchlist.
  ///
  /// In en, this message translates to:
  /// **'Watchlist'**
  String get commonWatchlist;

  /// No description provided for @commonDiscovered.
  ///
  /// In en, this message translates to:
  /// **'Discovered'**
  String get commonDiscovered;

  /// No description provided for @commonBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get commonBack;

  /// No description provided for @commonHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get commonHome;

  /// No description provided for @commonShowMore.
  ///
  /// In en, this message translates to:
  /// **'Show more'**
  String get commonShowMore;

  /// No description provided for @commonShowLess.
  ///
  /// In en, this message translates to:
  /// **'Show less'**
  String get commonShowLess;

  /// No description provided for @commonNoImage.
  ///
  /// In en, this message translates to:
  /// **'No image available'**
  String get commonNoImage;

  /// No description provided for @commonTrailer.
  ///
  /// In en, this message translates to:
  /// **'Trailer'**
  String get commonTrailer;

  /// No description provided for @commonRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get commonRemove;

  /// No description provided for @commonAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get commonAll;

  /// No description provided for @commonMovies.
  ///
  /// In en, this message translates to:
  /// **'Movies'**
  String get commonMovies;

  /// No description provided for @commonTvShows.
  ///
  /// In en, this message translates to:
  /// **'TV Shows'**
  String get commonTvShows;

  /// No description provided for @homeTitle.
  ///
  /// In en, this message translates to:
  /// **'Random {type} Generator'**
  String homeTitle(String type);

  /// No description provided for @homeMovie.
  ///
  /// In en, this message translates to:
  /// **'Movie'**
  String get homeMovie;

  /// No description provided for @homeTvShow.
  ///
  /// In en, this message translates to:
  /// **'TV Show'**
  String get homeTvShow;

  /// No description provided for @homeDescription.
  ///
  /// In en, this message translates to:
  /// **'Discover random movies and TV shows based on your preferences. Filter by genre, year, and rating to find your next favorite entertainment.'**
  String get homeDescription;

  /// No description provided for @homeHideFilters.
  ///
  /// In en, this message translates to:
  /// **'Hide filters'**
  String get homeHideFilters;

  /// No description provided for @homeShowFilters.
  ///
  /// In en, this message translates to:
  /// **'Show filters'**
  String get homeShowFilters;

  /// No description provided for @homeGenerate.
  ///
  /// In en, this message translates to:
  /// **'Generate Random Content'**
  String get homeGenerate;

  /// No description provided for @homeGenerateMobile.
  ///
  /// In en, this message translates to:
  /// **'Generate a new {type}'**
  String homeGenerateMobile(String type);

  /// No description provided for @homeMovieMobile.
  ///
  /// In en, this message translates to:
  /// **'movie'**
  String get homeMovieMobile;

  /// No description provided for @homeTvMobile.
  ///
  /// In en, this message translates to:
  /// **'TV content'**
  String get homeTvMobile;

  /// No description provided for @notFoundTitle.
  ///
  /// In en, this message translates to:
  /// **'Page not found'**
  String get notFoundTitle;

  /// No description provided for @notFoundDescription.
  ///
  /// In en, this message translates to:
  /// **'The page you are looking for does not exist or has been moved.'**
  String get notFoundDescription;

  /// No description provided for @notFoundGoHome.
  ///
  /// In en, this message translates to:
  /// **'Back to home'**
  String get notFoundGoHome;

  /// No description provided for @filtersMediaType.
  ///
  /// In en, this message translates to:
  /// **'Media Type'**
  String get filtersMediaType;

  /// No description provided for @filtersRating.
  ///
  /// In en, this message translates to:
  /// **'Rating'**
  String get filtersRating;

  /// No description provided for @filtersYear.
  ///
  /// In en, this message translates to:
  /// **'Release Year'**
  String get filtersYear;

  /// No description provided for @filtersYearDescription.
  ///
  /// In en, this message translates to:
  /// **'Choose a year range to limit the search.'**
  String get filtersYearDescription;

  /// No description provided for @filtersVoteCount.
  ///
  /// In en, this message translates to:
  /// **'Minimum Number of Votes'**
  String get filtersVoteCount;

  /// No description provided for @filtersGenres.
  ///
  /// In en, this message translates to:
  /// **'Genres'**
  String get filtersGenres;

  /// No description provided for @filtersFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get filtersFrom;

  /// No description provided for @filtersTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get filtersTo;

  /// No description provided for @filtersAny.
  ///
  /// In en, this message translates to:
  /// **'Any'**
  String get filtersAny;

  /// No description provided for @watchlistTitle.
  ///
  /// In en, this message translates to:
  /// **'My Watchlist'**
  String get watchlistTitle;

  /// No description provided for @watchlistLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading your watchlist...'**
  String get watchlistLoading;

  /// No description provided for @watchlistErrorTitle.
  ///
  /// In en, this message translates to:
  /// **'Error Loading Watchlist'**
  String get watchlistErrorTitle;

  /// No description provided for @watchlistEmpty.
  ///
  /// In en, this message translates to:
  /// **'Your watchlist is empty'**
  String get watchlistEmpty;

  /// No description provided for @watchlistEmptyMovies.
  ///
  /// In en, this message translates to:
  /// **'No movies yet'**
  String get watchlistEmptyMovies;

  /// No description provided for @watchlistEmptyTv.
  ///
  /// In en, this message translates to:
  /// **'No TV shows yet'**
  String get watchlistEmptyTv;

  /// No description provided for @watchlistEmptyDescription.
  ///
  /// In en, this message translates to:
  /// **'Start building your watchlist by adding movies and TV shows you want to watch.'**
  String get watchlistEmptyDescription;

  /// No description provided for @watchlistEmptyFilterDescription.
  ///
  /// In en, this message translates to:
  /// **'You haven\'t added any {type} to your watchlist yet.'**
  String watchlistEmptyFilterDescription(String type);

  /// No description provided for @watchlistDiscoverContent.
  ///
  /// In en, this message translates to:
  /// **'Discover new content'**
  String get watchlistDiscoverContent;

  /// No description provided for @watchlistTotalItems.
  ///
  /// In en, this message translates to:
  /// **'Total Items'**
  String get watchlistTotalItems;

  /// No description provided for @watchlistItem.
  ///
  /// In en, this message translates to:
  /// **'item'**
  String get watchlistItem;

  /// No description provided for @watchlistItems.
  ///
  /// In en, this message translates to:
  /// **'items'**
  String get watchlistItems;

  /// No description provided for @watchlistInList.
  ///
  /// In en, this message translates to:
  /// **'in list'**
  String get watchlistInList;

  /// No description provided for @discoveredTitle.
  ///
  /// In en, this message translates to:
  /// **'Discovered titles'**
  String get discoveredTitle;

  /// No description provided for @discoveredLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading discovered titles...'**
  String get discoveredLoading;

  /// No description provided for @discoveredEmpty.
  ///
  /// In en, this message translates to:
  /// **'No discovered titles yet'**
  String get discoveredEmpty;

  /// No description provided for @discoveredEmptyMovies.
  ///
  /// In en, this message translates to:
  /// **'No discovered movies yet'**
  String get discoveredEmptyMovies;

  /// No description provided for @discoveredEmptyTv.
  ///
  /// In en, this message translates to:
  /// **'No discovered TV shows yet'**
  String get discoveredEmptyTv;

  /// No description provided for @discoveredEmptyDescription.
  ///
  /// In en, this message translates to:
  /// **'Titles you generate appear here and will not be suggested again until you remove them.'**
  String get discoveredEmptyDescription;

  /// No description provided for @discoveredGenerateMore.
  ///
  /// In en, this message translates to:
  /// **'Generate random titles'**
  String get discoveredGenerateMore;

  /// No description provided for @discoveredTotalItems.
  ///
  /// In en, this message translates to:
  /// **'Total discovered'**
  String get discoveredTotalItems;

  /// No description provided for @discoveredInList.
  ///
  /// In en, this message translates to:
  /// **'discovered'**
  String get discoveredInList;

  /// No description provided for @mediaAdding.
  ///
  /// In en, this message translates to:
  /// **'Adding...'**
  String get mediaAdding;

  /// No description provided for @mediaRemoving.
  ///
  /// In en, this message translates to:
  /// **'Removing...'**
  String get mediaRemoving;

  /// No description provided for @mediaSave.
  ///
  /// In en, this message translates to:
  /// **'Add to Watchlist'**
  String get mediaSave;

  /// No description provided for @mediaSaved.
  ///
  /// In en, this message translates to:
  /// **'In Watchlist'**
  String get mediaSaved;

  /// No description provided for @mediaRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove from watchlist'**
  String get mediaRemove;

  /// No description provided for @mediaOnTmdb.
  ///
  /// In en, this message translates to:
  /// **'View {title} on TMDB'**
  String mediaOnTmdb(String title);

  /// No description provided for @authWelcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome Back'**
  String get authWelcome;

  /// No description provided for @authSignInToContinue.
  ///
  /// In en, this message translates to:
  /// **'Sign in to continue your journey'**
  String get authSignInToContinue;

  /// No description provided for @authUsername.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get authUsername;

  /// No description provided for @authPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get authPassword;

  /// No description provided for @authForgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get authForgotPassword;

  /// No description provided for @authSignIn.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get authSignIn;

  /// No description provided for @authSigningIn.
  ///
  /// In en, this message translates to:
  /// **'Signing in...'**
  String get authSigningIn;

  /// No description provided for @authNoAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account?'**
  String get authNoAccount;

  /// No description provided for @authCreateAccount.
  ///
  /// In en, this message translates to:
  /// **'Create one now'**
  String get authCreateAccount;

  /// No description provided for @authUsernamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter your username'**
  String get authUsernamePlaceholder;

  /// No description provided for @authPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter your password'**
  String get authPasswordPlaceholder;

  /// No description provided for @authLoginError.
  ///
  /// In en, this message translates to:
  /// **'Error during login'**
  String get authLoginError;

  /// No description provided for @authEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get authEmail;

  /// No description provided for @authEmailPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter your email'**
  String get authEmailPlaceholder;

  /// No description provided for @authConfirmPassword.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get authConfirmPassword;

  /// No description provided for @authConfirmPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Confirm your password'**
  String get authConfirmPasswordPlaceholder;

  /// No description provided for @authRegister.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get authRegister;

  /// No description provided for @authRegistering.
  ///
  /// In en, this message translates to:
  /// **'Creating account...'**
  String get authRegistering;

  /// No description provided for @authAlreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get authAlreadyHaveAccount;

  /// No description provided for @authSignInInstead.
  ///
  /// In en, this message translates to:
  /// **'Sign in instead'**
  String get authSignInInstead;

  /// No description provided for @authForgotPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Forgot your password?'**
  String get authForgotPasswordTitle;

  /// No description provided for @authForgotPasswordDescription.
  ///
  /// In en, this message translates to:
  /// **'Enter your email and we\'ll send you a link to reset your password.'**
  String get authForgotPasswordDescription;

  /// No description provided for @authSendResetLink.
  ///
  /// In en, this message translates to:
  /// **'Send Reset Link'**
  String get authSendResetLink;

  /// No description provided for @authSending.
  ///
  /// In en, this message translates to:
  /// **'Sending...'**
  String get authSending;

  /// No description provided for @authForgotPasswordSuccess.
  ///
  /// In en, this message translates to:
  /// **'If an account with that email exists, a password reset link has been sent.'**
  String get authForgotPasswordSuccess;

  /// No description provided for @authBackToLogin.
  ///
  /// In en, this message translates to:
  /// **'Back to login'**
  String get authBackToLogin;

  /// No description provided for @authResetPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Reset your password'**
  String get authResetPasswordTitle;

  /// No description provided for @authNewPassword.
  ///
  /// In en, this message translates to:
  /// **'New Password'**
  String get authNewPassword;

  /// No description provided for @authNewPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter your new password'**
  String get authNewPasswordPlaceholder;

  /// No description provided for @authResetPassword.
  ///
  /// In en, this message translates to:
  /// **'Reset Password'**
  String get authResetPassword;

  /// No description provided for @authResetting.
  ///
  /// In en, this message translates to:
  /// **'Resetting...'**
  String get authResetting;

  /// No description provided for @authResetPasswordSuccess.
  ///
  /// In en, this message translates to:
  /// **'Password has been reset successfully.'**
  String get authResetPasswordSuccess;

  /// No description provided for @authChangePasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get authChangePasswordTitle;

  /// No description provided for @authCurrentPassword.
  ///
  /// In en, this message translates to:
  /// **'Current Password'**
  String get authCurrentPassword;

  /// No description provided for @authCurrentPasswordPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Enter your current password'**
  String get authCurrentPasswordPlaceholder;

  /// No description provided for @authChangePassword.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get authChangePassword;

  /// No description provided for @authChanging.
  ///
  /// In en, this message translates to:
  /// **'Updating...'**
  String get authChanging;

  /// No description provided for @authChangePasswordSuccess.
  ///
  /// In en, this message translates to:
  /// **'Password changed successfully.'**
  String get authChangePasswordSuccess;

  /// No description provided for @authPasswordMinLength.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least {min} characters'**
  String authPasswordMinLength(int min);

  /// No description provided for @authPasswordsDoNotMatch.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get authPasswordsDoNotMatch;

  /// No description provided for @authRegisterTitle.
  ///
  /// In en, this message translates to:
  /// **'Join Us'**
  String get authRegisterTitle;

  /// No description provided for @authRegisterDescription.
  ///
  /// In en, this message translates to:
  /// **'Create your account and start discovering'**
  String get authRegisterDescription;

  /// No description provided for @authProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get authProfile;

  /// No description provided for @authUsernameRequired.
  ///
  /// In en, this message translates to:
  /// **'Username is required'**
  String get authUsernameRequired;

  /// No description provided for @authEmailRequired.
  ///
  /// In en, this message translates to:
  /// **'Email is required'**
  String get authEmailRequired;

  /// No description provided for @authInvalidEmail.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid email'**
  String get authInvalidEmail;

  /// No description provided for @authPasswordRequired.
  ///
  /// In en, this message translates to:
  /// **'Password is required'**
  String get authPasswordRequired;

  /// No description provided for @authResetTokenError.
  ///
  /// In en, this message translates to:
  /// **'No reset token found. Please request a new password reset link.'**
  String get authResetTokenError;

  /// No description provided for @authInvalidLink.
  ///
  /// In en, this message translates to:
  /// **'Invalid Link'**
  String get authInvalidLink;

  /// No description provided for @authRequired.
  ///
  /// In en, this message translates to:
  /// **'Required'**
  String get authRequired;

  /// No description provided for @commonUnknown.
  ///
  /// In en, this message translates to:
  /// **'Unknown'**
  String get commonUnknown;

  /// No description provided for @commonProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get commonProfile;

  /// No description provided for @commonItem.
  ///
  /// In en, this message translates to:
  /// **'item'**
  String get commonItem;

  /// No description provided for @commonItems.
  ///
  /// In en, this message translates to:
  /// **'items'**
  String get commonItems;

  /// No description provided for @commonInList.
  ///
  /// In en, this message translates to:
  /// **'in list'**
  String get commonInList;

  /// No description provided for @homeLoading.
  ///
  /// In en, this message translates to:
  /// **'Finding something great...'**
  String get homeLoading;

  /// No description provided for @mediaImageUnavailable.
  ///
  /// In en, this message translates to:
  /// **'Image unavailable'**
  String get mediaImageUnavailable;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'it'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'it':
      return AppLocalizationsIt();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
