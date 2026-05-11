import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/home/home_screen.dart';
import '../screens/watchlist/watchlist_screen.dart';
import '../screens/discovered/discovered_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/auth/change_password_screen.dart';
import '../screens/not_found_screen.dart';
import '../widgets/language_switcher.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

GoRouter createRouter(Ref ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final auth = authState.valueOrNull;
      final isAuthenticated = auth?.token != null;
      final isAuthRoute = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
      ].contains(state.matchedLocation);

      if (!isAuthenticated && !isAuthRoute) return '/login';
      if (isAuthenticated && isAuthRoute) return '/';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/reset-password',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'];
          return ResetPasswordScreen(token: token);
        },
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return AuthenticatedShell(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: '/watchlist',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: WatchlistScreen(),
            ),
          ),
          GoRoute(
            path: '/discovered',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DiscoveredScreen(),
            ),
          ),
          GoRoute(
            path: '/profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ChangePasswordScreen(),
            ),
          ),
        ],
      ),
      GoRoute(
        path: '/:path',
        builder: (context, state) => const NotFoundScreen(),
      ),
    ],
  );
}

final routerProvider = Provider<GoRouter>(createRouter);

class AuthenticatedShell extends ConsumerStatefulWidget {
  const AuthenticatedShell({super.key, required this.child});
  final Widget child;

  @override
  ConsumerState<AuthenticatedShell> createState() => _AuthenticatedShellState();
}

class _AuthenticatedShellState extends ConsumerState<AuthenticatedShell> {
  int _currentIndex = 0;

  static const _routes = ['/', '/watchlist', '/discovered', '/profile'];

  void _onTap(int index) {
    setState(() => _currentIndex = index);
    context.go(_routes[index]);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final location = GoRouterState.of(context).matchedLocation;
    final idx = _routes.indexOf(location);
    if (idx >= 0 && idx != _currentIndex) {
      setState(() => _currentIndex = idx);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;
    final locale = ref.watch(localeProvider);

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTap,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.casino_outlined),
            activeIcon: const Icon(Icons.casino),
            label: t.commonHome,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.bookmark_outline),
            activeIcon: const Icon(Icons.bookmark),
            label: t.commonWatchlist,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.explore_outlined),
            activeIcon: const Icon(Icons.explore),
            label: t.commonDiscovered,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            activeIcon: const Icon(Icons.person),
            label: t.authProfile,
          ),
        ],
      ),
    );
  }
}