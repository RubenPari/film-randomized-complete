// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Italian (`it`).
class AppLocalizationsIt extends AppLocalizations {
  AppLocalizationsIt([String locale = 'it']) : super(locale);

  @override
  String get commonLoading => 'Caricamento...';

  @override
  String get commonError => 'Errore';

  @override
  String get commonLogout => 'Esci';

  @override
  String get commonWatchlist => 'Watchlist';

  @override
  String get commonDiscovered => 'Scoperti';

  @override
  String get commonBack => 'Indietro';

  @override
  String get commonHome => 'Home';

  @override
  String get commonShowMore => 'Mostra di più';

  @override
  String get commonShowLess => 'Mostra meno';

  @override
  String get commonNoImage => 'Nessuna immagine disponibile';

  @override
  String get commonTrailer => 'Trailer';

  @override
  String get commonRemove => 'Rimuovi';

  @override
  String get commonAll => 'Tutti';

  @override
  String get commonMovies => 'Film';

  @override
  String get commonTvShows => 'Serie TV';

  @override
  String homeTitle(String type) {
    return 'Generatore di $type Casuali';
  }

  @override
  String get homeMovie => 'Film';

  @override
  String get homeTvShow => 'Serie TV';

  @override
  String get homeDescription =>
      'Scopri film e serie TV casuali in base alle tue preferenze. Filtra per genere, anno e valutazione per trovare il tuo prossimo intrattenimento preferito.';

  @override
  String get homeHideFilters => 'Nascondi filtri';

  @override
  String get homeShowFilters => 'Mostra filtri';

  @override
  String get homeGenerate => 'Genera Contenuto Casuale';

  @override
  String homeGenerateMobile(String type) {
    return 'Genera un nuovo $type';
  }

  @override
  String get homeMovieMobile => 'film';

  @override
  String get homeTvMobile => 'contenuto TV';

  @override
  String get notFoundTitle => 'Pagina non trovata';

  @override
  String get notFoundDescription =>
      'La pagina che cerchi non esiste o è stata spostata.';

  @override
  String get notFoundGoHome => 'Torna alla home';

  @override
  String get filtersMediaType => 'Tipo di Media';

  @override
  String get filtersRating => 'Valutazione';

  @override
  String get filtersYear => 'Anno di Rilascio';

  @override
  String get filtersYearDescription =>
      'Scegli un intervallo di anni per limitare la ricerca.';

  @override
  String get filtersVoteCount => 'Numero Minimo di Voti';

  @override
  String get filtersGenres => 'Generi';

  @override
  String get filtersFrom => 'Da';

  @override
  String get filtersTo => 'A';

  @override
  String get filtersAny => 'Qualsiasi';

  @override
  String get watchlistTitle => 'La Mia Watchlist';

  @override
  String get watchlistLoading => 'Caricamento della tua watchlist...';

  @override
  String get watchlistErrorTitle => 'Errore nel Caricamento della Watchlist';

  @override
  String get watchlistEmpty => 'La tua watchlist è vuota';

  @override
  String get watchlistEmptyMovies => 'Ancora nessun film';

  @override
  String get watchlistEmptyTv => 'Ancora nessuna serie TV';

  @override
  String get watchlistEmptyDescription =>
      'Inizia a costruire la tua watchlist aggiungendo film e serie TV che vuoi guardare.';

  @override
  String watchlistEmptyFilterDescription(String type) {
    return 'Non hai ancora aggiunto $type alla tua watchlist.';
  }

  @override
  String get watchlistDiscoverContent => 'Scopri nuovi contenuti';

  @override
  String get watchlistTotalItems => 'Elementi Totali';

  @override
  String get watchlistItem => 'elemento';

  @override
  String get watchlistItems => 'elementi';

  @override
  String get watchlistInList => 'in elenco';

  @override
  String get discoveredTitle => 'Titoli scoperti';

  @override
  String get discoveredLoading => 'Caricamento titoli scoperti...';

  @override
  String get discoveredEmpty => 'Nessun titolo scoperto';

  @override
  String get discoveredEmptyMovies => 'Nessun film scoperto';

  @override
  String get discoveredEmptyTv => 'Nessuna serie scoperta';

  @override
  String get discoveredEmptyDescription =>
      'I titoli che generi compaiono qui e non verranno più proposti finché non li rimuovi.';

  @override
  String get discoveredGenerateMore => 'Genera altri titoli';

  @override
  String get discoveredTotalItems => 'Totale scoperti';

  @override
  String get discoveredInList => 'scoperti';

  @override
  String get mediaAdding => 'Aggiunta...';

  @override
  String get mediaRemoving => 'Rimozione...';

  @override
  String get mediaSave => 'Aggiungi alla Watchlist';

  @override
  String get mediaSaved => 'Nella Watchlist';

  @override
  String get mediaRemove => 'Rimuovi dalla watchlist';

  @override
  String mediaOnTmdb(String title) {
    return 'Vedi $title su TMDB';
  }

  @override
  String get authWelcome => 'Bentornato';

  @override
  String get authSignInToContinue => 'Accedi per continuare il tuo viaggio';

  @override
  String get authUsername => 'Nome utente';

  @override
  String get authPassword => 'Password';

  @override
  String get authForgotPassword => 'Password dimenticata?';

  @override
  String get authSignIn => 'Accedi';

  @override
  String get authSigningIn => 'Accesso in corso...';

  @override
  String get authNoAccount => 'Non hai un account?';

  @override
  String get authCreateAccount => 'Creane uno ora';

  @override
  String get authUsernamePlaceholder => 'Inserisci il tuo nome utente';

  @override
  String get authPasswordPlaceholder => 'Inserisci la tua password';

  @override
  String get authLoginError => 'Errore durante l\'accesso';

  @override
  String get authEmail => 'Email';

  @override
  String get authEmailPlaceholder => 'Inserisci la tua email';

  @override
  String get authConfirmPassword => 'Conferma Password';

  @override
  String get authConfirmPasswordPlaceholder => 'Conferma la tua password';

  @override
  String get authRegister => 'Crea Account';

  @override
  String get authRegistering => 'Creazione account...';

  @override
  String get authAlreadyHaveAccount => 'Hai già un account?';

  @override
  String get authSignInInstead => 'Accedi invece';

  @override
  String get authForgotPasswordTitle => 'Hai dimenticato la password?';

  @override
  String get authForgotPasswordDescription =>
      'Inserisci la tua email e ti invieremo un link per reimpostare la password.';

  @override
  String get authSendResetLink => 'Invia Link di Reimpostazione';

  @override
  String get authSending => 'Invio in corso...';

  @override
  String get authForgotPasswordSuccess =>
      'Se esiste un account con quella email, è stato inviato un link per reimpostare la password.';

  @override
  String get authBackToLogin => 'Torna al login';

  @override
  String get authResetPasswordTitle => 'Reimposta la tua password';

  @override
  String get authNewPassword => 'Nuova Password';

  @override
  String get authNewPasswordPlaceholder => 'Inserisci la tua nuova password';

  @override
  String get authResetPassword => 'Reimposta Password';

  @override
  String get authResetting => 'Reimpostazione...';

  @override
  String get authResetPasswordSuccess =>
      'La password è stata reimpostata con successo.';

  @override
  String get authChangePasswordTitle => 'Cambia Password';

  @override
  String get authCurrentPassword => 'Password Attuale';

  @override
  String get authCurrentPasswordPlaceholder =>
      'Inserisci la tua password attuale';

  @override
  String get authChangePassword => 'Cambia Password';

  @override
  String get authChanging => 'Aggiornamento...';

  @override
  String get authChangePasswordSuccess => 'Password cambiata con successo.';

  @override
  String authPasswordMinLength(int min) {
    return 'La password deve essere di almeno $min caratteri';
  }

  @override
  String get authPasswordsDoNotMatch => 'Le password non corrispondono';

  @override
  String get authRegisterTitle => 'Unisciti a Noi';

  @override
  String get authRegisterDescription =>
      'Crea il tuo account e inizia a scoprire';

  @override
  String get authProfile => 'Profilo';

  @override
  String get authUsernameRequired => 'Il nome utente è obbligatorio';

  @override
  String get authEmailRequired => 'L\'email è obbligatoria';

  @override
  String get authInvalidEmail => 'Inserisci un\'email valida';

  @override
  String get authPasswordRequired => 'La password è obbligatoria';

  @override
  String get authResetTokenError =>
      'Nessun token di ripristino trovato. Richiedi un nuovo link per reimpostare la password.';

  @override
  String get authInvalidLink => 'Link non valido';

  @override
  String get authRequired => 'Obbligatorio';

  @override
  String get commonUnknown => 'Sconosciuto';

  @override
  String get commonProfile => 'Profilo';

  @override
  String get commonItem => 'elemento';

  @override
  String get commonItems => 'elementi';

  @override
  String get commonInList => 'in elenco';

  @override
  String get homeLoading => 'Ricerca in corso...';

  @override
  String get mediaImageUnavailable => 'Immagine non disponibile';
}
