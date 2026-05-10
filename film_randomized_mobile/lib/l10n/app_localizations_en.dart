// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get commonLoading => 'Loading...';

  @override
  String get commonError => 'Error';

  @override
  String get commonLogout => 'Logout';

  @override
  String get commonWatchlist => 'Watchlist';

  @override
  String get commonDiscovered => 'Discovered';

  @override
  String get commonBack => 'Back';

  @override
  String get commonHome => 'Home';

  @override
  String get commonShowMore => 'Show more';

  @override
  String get commonShowLess => 'Show less';

  @override
  String get commonNoImage => 'No image available';

  @override
  String get commonTrailer => 'Trailer';

  @override
  String get commonRemove => 'Remove';

  @override
  String get commonAll => 'All';

  @override
  String get commonMovies => 'Movies';

  @override
  String get commonTvShows => 'TV Shows';

  @override
  String homeTitle(String type) {
    return 'Random $type Generator';
  }

  @override
  String get homeMovie => 'Movie';

  @override
  String get homeTvShow => 'TV Show';

  @override
  String get homeDescription =>
      'Discover random movies and TV shows based on your preferences. Filter by genre, year, and rating to find your next favorite entertainment.';

  @override
  String get homeHideFilters => 'Hide filters';

  @override
  String get homeShowFilters => 'Show filters';

  @override
  String get homeGenerate => 'Generate Random Content';

  @override
  String homeGenerateMobile(String type) {
    return 'Generate a new $type';
  }

  @override
  String get homeMovieMobile => 'movie';

  @override
  String get homeTvMobile => 'TV content';

  @override
  String get notFoundTitle => 'Page not found';

  @override
  String get notFoundDescription =>
      'The page you are looking for does not exist or has been moved.';

  @override
  String get notFoundGoHome => 'Back to home';

  @override
  String get filtersMediaType => 'Media Type';

  @override
  String get filtersRating => 'Rating';

  @override
  String get filtersYear => 'Release Year';

  @override
  String get filtersYearDescription =>
      'Choose a year range to limit the search.';

  @override
  String get filtersVoteCount => 'Minimum Number of Votes';

  @override
  String get filtersGenres => 'Genres';

  @override
  String get filtersFrom => 'From';

  @override
  String get filtersTo => 'To';

  @override
  String get filtersAny => 'Any';

  @override
  String get watchlistTitle => 'My Watchlist';

  @override
  String get watchlistLoading => 'Loading your watchlist...';

  @override
  String get watchlistErrorTitle => 'Error Loading Watchlist';

  @override
  String get watchlistEmpty => 'Your watchlist is empty';

  @override
  String get watchlistEmptyMovies => 'No movies yet';

  @override
  String get watchlistEmptyTv => 'No TV shows yet';

  @override
  String get watchlistEmptyDescription =>
      'Start building your watchlist by adding movies and TV shows you want to watch.';

  @override
  String watchlistEmptyFilterDescription(String type) {
    return 'You haven\'t added any $type to your watchlist yet.';
  }

  @override
  String get watchlistDiscoverContent => 'Discover new content';

  @override
  String get watchlistTotalItems => 'Total Items';

  @override
  String get watchlistItem => 'item';

  @override
  String get watchlistItems => 'items';

  @override
  String get watchlistInList => 'in list';

  @override
  String get discoveredTitle => 'Discovered titles';

  @override
  String get discoveredLoading => 'Loading discovered titles...';

  @override
  String get discoveredEmpty => 'No discovered titles yet';

  @override
  String get discoveredEmptyMovies => 'No discovered movies yet';

  @override
  String get discoveredEmptyTv => 'No discovered TV shows yet';

  @override
  String get discoveredEmptyDescription =>
      'Titles you generate appear here and will not be suggested again until you remove them.';

  @override
  String get discoveredGenerateMore => 'Generate random titles';

  @override
  String get discoveredTotalItems => 'Total discovered';

  @override
  String get discoveredInList => 'discovered';

  @override
  String get mediaAdding => 'Adding...';

  @override
  String get mediaRemoving => 'Removing...';

  @override
  String get mediaSave => 'Add to Watchlist';

  @override
  String get mediaSaved => 'In Watchlist';

  @override
  String get mediaRemove => 'Remove from watchlist';

  @override
  String mediaOnTmdb(String title) {
    return 'View $title on TMDB';
  }

  @override
  String get authWelcome => 'Welcome Back';

  @override
  String get authSignInToContinue => 'Sign in to continue your journey';

  @override
  String get authUsername => 'Username';

  @override
  String get authPassword => 'Password';

  @override
  String get authForgotPassword => 'Forgot password?';

  @override
  String get authSignIn => 'Sign In';

  @override
  String get authSigningIn => 'Signing in...';

  @override
  String get authNoAccount => 'Don\'t have an account?';

  @override
  String get authCreateAccount => 'Create one now';

  @override
  String get authUsernamePlaceholder => 'Enter your username';

  @override
  String get authPasswordPlaceholder => 'Enter your password';

  @override
  String get authLoginError => 'Error during login';

  @override
  String get authEmail => 'Email';

  @override
  String get authEmailPlaceholder => 'Enter your email';

  @override
  String get authConfirmPassword => 'Confirm Password';

  @override
  String get authConfirmPasswordPlaceholder => 'Confirm your password';

  @override
  String get authRegister => 'Create Account';

  @override
  String get authRegistering => 'Creating account...';

  @override
  String get authAlreadyHaveAccount => 'Already have an account?';

  @override
  String get authSignInInstead => 'Sign in instead';

  @override
  String get authForgotPasswordTitle => 'Forgot your password?';

  @override
  String get authForgotPasswordDescription =>
      'Enter your email and we\'ll send you a link to reset your password.';

  @override
  String get authSendResetLink => 'Send Reset Link';

  @override
  String get authSending => 'Sending...';

  @override
  String get authForgotPasswordSuccess =>
      'If an account with that email exists, a password reset link has been sent.';

  @override
  String get authBackToLogin => 'Back to login';

  @override
  String get authResetPasswordTitle => 'Reset your password';

  @override
  String get authNewPassword => 'New Password';

  @override
  String get authNewPasswordPlaceholder => 'Enter your new password';

  @override
  String get authResetPassword => 'Reset Password';

  @override
  String get authResetting => 'Resetting...';

  @override
  String get authResetPasswordSuccess =>
      'Password has been reset successfully.';

  @override
  String get authChangePasswordTitle => 'Change Password';

  @override
  String get authCurrentPassword => 'Current Password';

  @override
  String get authCurrentPasswordPlaceholder => 'Enter your current password';

  @override
  String get authChangePassword => 'Change Password';

  @override
  String get authChanging => 'Updating...';

  @override
  String get authChangePasswordSuccess => 'Password changed successfully.';

  @override
  String authPasswordMinLength(int min) {
    return 'Password must be at least $min characters';
  }

  @override
  String get authPasswordsDoNotMatch => 'Passwords do not match';

  @override
  String get authRegisterTitle => 'Join Us';

  @override
  String get authRegisterDescription =>
      'Create your account and start discovering';

  @override
  String get authProfile => 'Profile';

  @override
  String get authUsernameRequired => 'Username is required';

  @override
  String get authEmailRequired => 'Email is required';

  @override
  String get authInvalidEmail => 'Enter a valid email';

  @override
  String get authPasswordRequired => 'Password is required';

  @override
  String get authResetTokenError =>
      'No reset token found. Please request a new password reset link.';

  @override
  String get authInvalidLink => 'Invalid Link';

  @override
  String get authRequired => 'Required';
}
