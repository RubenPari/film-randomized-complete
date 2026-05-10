// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'filter_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

/// @nodoc
mixin _$FilterState {
  MediaType get mediaType => throw _privateConstructorUsedError;
  double get minRating => throw _privateConstructorUsedError;
  double get maxRating => throw _privateConstructorUsedError;
  int get releaseYearFrom => throw _privateConstructorUsedError;
  int get releaseYearTo => throw _privateConstructorUsedError;
  int get minVoteCount => throw _privateConstructorUsedError;
  List<int> get selectedGenres => throw _privateConstructorUsedError;

  /// Create a copy of FilterState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $FilterStateCopyWith<FilterState> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $FilterStateCopyWith<$Res> {
  factory $FilterStateCopyWith(
    FilterState value,
    $Res Function(FilterState) then,
  ) = _$FilterStateCopyWithImpl<$Res, FilterState>;
  @useResult
  $Res call({
    MediaType mediaType,
    double minRating,
    double maxRating,
    int releaseYearFrom,
    int releaseYearTo,
    int minVoteCount,
    List<int> selectedGenres,
  });
}

/// @nodoc
class _$FilterStateCopyWithImpl<$Res, $Val extends FilterState>
    implements $FilterStateCopyWith<$Res> {
  _$FilterStateCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of FilterState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? mediaType = null,
    Object? minRating = null,
    Object? maxRating = null,
    Object? releaseYearFrom = null,
    Object? releaseYearTo = null,
    Object? minVoteCount = null,
    Object? selectedGenres = null,
  }) {
    return _then(
      _value.copyWith(
            mediaType: null == mediaType
                ? _value.mediaType
                : mediaType // ignore: cast_nullable_to_non_nullable
                      as MediaType,
            minRating: null == minRating
                ? _value.minRating
                : minRating // ignore: cast_nullable_to_non_nullable
                      as double,
            maxRating: null == maxRating
                ? _value.maxRating
                : maxRating // ignore: cast_nullable_to_non_nullable
                      as double,
            releaseYearFrom: null == releaseYearFrom
                ? _value.releaseYearFrom
                : releaseYearFrom // ignore: cast_nullable_to_non_nullable
                      as int,
            releaseYearTo: null == releaseYearTo
                ? _value.releaseYearTo
                : releaseYearTo // ignore: cast_nullable_to_non_nullable
                      as int,
            minVoteCount: null == minVoteCount
                ? _value.minVoteCount
                : minVoteCount // ignore: cast_nullable_to_non_nullable
                      as int,
            selectedGenres: null == selectedGenres
                ? _value.selectedGenres
                : selectedGenres // ignore: cast_nullable_to_non_nullable
                      as List<int>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$FilterStateImplCopyWith<$Res>
    implements $FilterStateCopyWith<$Res> {
  factory _$$FilterStateImplCopyWith(
    _$FilterStateImpl value,
    $Res Function(_$FilterStateImpl) then,
  ) = __$$FilterStateImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    MediaType mediaType,
    double minRating,
    double maxRating,
    int releaseYearFrom,
    int releaseYearTo,
    int minVoteCount,
    List<int> selectedGenres,
  });
}

/// @nodoc
class __$$FilterStateImplCopyWithImpl<$Res>
    extends _$FilterStateCopyWithImpl<$Res, _$FilterStateImpl>
    implements _$$FilterStateImplCopyWith<$Res> {
  __$$FilterStateImplCopyWithImpl(
    _$FilterStateImpl _value,
    $Res Function(_$FilterStateImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of FilterState
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? mediaType = null,
    Object? minRating = null,
    Object? maxRating = null,
    Object? releaseYearFrom = null,
    Object? releaseYearTo = null,
    Object? minVoteCount = null,
    Object? selectedGenres = null,
  }) {
    return _then(
      _$FilterStateImpl(
        mediaType: null == mediaType
            ? _value.mediaType
            : mediaType // ignore: cast_nullable_to_non_nullable
                  as MediaType,
        minRating: null == minRating
            ? _value.minRating
            : minRating // ignore: cast_nullable_to_non_nullable
                  as double,
        maxRating: null == maxRating
            ? _value.maxRating
            : maxRating // ignore: cast_nullable_to_non_nullable
                  as double,
        releaseYearFrom: null == releaseYearFrom
            ? _value.releaseYearFrom
            : releaseYearFrom // ignore: cast_nullable_to_non_nullable
                  as int,
        releaseYearTo: null == releaseYearTo
            ? _value.releaseYearTo
            : releaseYearTo // ignore: cast_nullable_to_non_nullable
                  as int,
        minVoteCount: null == minVoteCount
            ? _value.minVoteCount
            : minVoteCount // ignore: cast_nullable_to_non_nullable
                  as int,
        selectedGenres: null == selectedGenres
            ? _value._selectedGenres
            : selectedGenres // ignore: cast_nullable_to_non_nullable
                  as List<int>,
      ),
    );
  }
}

/// @nodoc

class _$FilterStateImpl implements _FilterState {
  const _$FilterStateImpl({
    this.mediaType = MediaType.movie,
    this.minRating = 0.0,
    this.maxRating = 10.0,
    this.releaseYearFrom = 1900,
    this.releaseYearTo = 2026,
    this.minVoteCount = 0,
    final List<int> selectedGenres = const [],
  }) : _selectedGenres = selectedGenres;

  @override
  @JsonKey()
  final MediaType mediaType;
  @override
  @JsonKey()
  final double minRating;
  @override
  @JsonKey()
  final double maxRating;
  @override
  @JsonKey()
  final int releaseYearFrom;
  @override
  @JsonKey()
  final int releaseYearTo;
  @override
  @JsonKey()
  final int minVoteCount;
  final List<int> _selectedGenres;
  @override
  @JsonKey()
  List<int> get selectedGenres {
    if (_selectedGenres is EqualUnmodifiableListView) return _selectedGenres;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_selectedGenres);
  }

  @override
  String toString() {
    return 'FilterState(mediaType: $mediaType, minRating: $minRating, maxRating: $maxRating, releaseYearFrom: $releaseYearFrom, releaseYearTo: $releaseYearTo, minVoteCount: $minVoteCount, selectedGenres: $selectedGenres)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$FilterStateImpl &&
            (identical(other.mediaType, mediaType) ||
                other.mediaType == mediaType) &&
            (identical(other.minRating, minRating) ||
                other.minRating == minRating) &&
            (identical(other.maxRating, maxRating) ||
                other.maxRating == maxRating) &&
            (identical(other.releaseYearFrom, releaseYearFrom) ||
                other.releaseYearFrom == releaseYearFrom) &&
            (identical(other.releaseYearTo, releaseYearTo) ||
                other.releaseYearTo == releaseYearTo) &&
            (identical(other.minVoteCount, minVoteCount) ||
                other.minVoteCount == minVoteCount) &&
            const DeepCollectionEquality().equals(
              other._selectedGenres,
              _selectedGenres,
            ));
  }

  @override
  int get hashCode => Object.hash(
    runtimeType,
    mediaType,
    minRating,
    maxRating,
    releaseYearFrom,
    releaseYearTo,
    minVoteCount,
    const DeepCollectionEquality().hash(_selectedGenres),
  );

  /// Create a copy of FilterState
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$FilterStateImplCopyWith<_$FilterStateImpl> get copyWith =>
      __$$FilterStateImplCopyWithImpl<_$FilterStateImpl>(this, _$identity);
}

abstract class _FilterState implements FilterState {
  const factory _FilterState({
    final MediaType mediaType,
    final double minRating,
    final double maxRating,
    final int releaseYearFrom,
    final int releaseYearTo,
    final int minVoteCount,
    final List<int> selectedGenres,
  }) = _$FilterStateImpl;

  @override
  MediaType get mediaType;
  @override
  double get minRating;
  @override
  double get maxRating;
  @override
  int get releaseYearFrom;
  @override
  int get releaseYearTo;
  @override
  int get minVoteCount;
  @override
  List<int> get selectedGenres;

  /// Create a copy of FilterState
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$FilterStateImplCopyWith<_$FilterStateImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
