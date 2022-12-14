// DO NOT EDIT.
// swift-format-ignore-file
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: PDTLogger.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import Foundation
import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that you are building against the same version of the API
// that was used to generate this file.
fileprivate struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
  struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
  typealias Version = _2
}

public struct LogLine {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var level: LogLine.LogLevel = .info

  public var tags: [String] = []

  public var message: String = String()

  public var date: SwiftProtobuf.Google_Protobuf_Timestamp {
    get {return _date ?? SwiftProtobuf.Google_Protobuf_Timestamp()}
    set {_date = newValue}
  }
  /// Returns true if `date` has been explicitly set.
  public var hasDate: Bool {return self._date != nil}
  /// Clears the value of `date`. Subsequent reads from it will return its default value.
  public mutating func clearDate() {self._date = nil}

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public enum LogLevel: SwiftProtobuf.Enum {
    public typealias RawValue = Int
    case info // = 0
    case warn // = 1
    case error // = 2
    case UNRECOGNIZED(Int)

    public init() {
      self = .info
    }

    public init?(rawValue: Int) {
      switch rawValue {
      case 0: self = .info
      case 1: self = .warn
      case 2: self = .error
      default: self = .UNRECOGNIZED(rawValue)
      }
    }

    public var rawValue: Int {
      switch self {
      case .info: return 0
      case .warn: return 1
      case .error: return 2
      case .UNRECOGNIZED(let i): return i
      }
    }

  }

  public init() {}

  fileprivate var _date: SwiftProtobuf.Google_Protobuf_Timestamp? = nil
}

#if swift(>=4.2)

extension LogLine.LogLevel: CaseIterable {
  // The compiler won't synthesize support with the UNRECOGNIZED case.
  public static var allCases: [LogLine.LogLevel] = [
    .info,
    .warn,
    .error,
  ]
}

#endif  // swift(>=4.2)

public struct LogFilter {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

// MARK: - Code below here is support for the SwiftProtobuf runtime.

extension LogLine: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = "LogLine"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "level"),
    2: .same(proto: "tags"),
    3: .same(proto: "message"),
    4: .same(proto: "date"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularEnumField(value: &self.level) }()
      case 2: try { try decoder.decodeRepeatedStringField(value: &self.tags) }()
      case 3: try { try decoder.decodeSingularStringField(value: &self.message) }()
      case 4: try { try decoder.decodeSingularMessageField(value: &self._date) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if self.level != .info {
      try visitor.visitSingularEnumField(value: self.level, fieldNumber: 1)
    }
    if !self.tags.isEmpty {
      try visitor.visitRepeatedStringField(value: self.tags, fieldNumber: 2)
    }
    if !self.message.isEmpty {
      try visitor.visitSingularStringField(value: self.message, fieldNumber: 3)
    }
    if let v = self._date {
      try visitor.visitSingularMessageField(value: v, fieldNumber: 4)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: LogLine, rhs: LogLine) -> Bool {
    if lhs.level != rhs.level {return false}
    if lhs.tags != rhs.tags {return false}
    if lhs.message != rhs.message {return false}
    if lhs._date != rhs._date {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension LogLine.LogLevel: SwiftProtobuf._ProtoNameProviding {
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    0: .same(proto: "INFO"),
    1: .same(proto: "WARN"),
    2: .same(proto: "ERROR"),
  ]
}

extension LogFilter: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = "LogFilter"
  public static let _protobuf_nameMap = SwiftProtobuf._NameMap()

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let _ = try decoder.nextFieldNumber() {
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: LogFilter, rhs: LogFilter) -> Bool {
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}
