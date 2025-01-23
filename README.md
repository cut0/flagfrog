# FlagFrog

A simple library for managing feature flags in your applications.

## Installation

```shell
# install
npm install flagfrog
```

### CLI

The CLI provides the following commands:

- [list](#list-command)
  - Displays where Flag is used
- [remove](#tree-command)
  - Remove Flag from files

### List Command

Displays where Flag is used

```shell
# input (Display the list of flags under src)
npx flagfrog list './src/**/*.{ts,tsx}'
```

```shell
# output
FlagName
├──/path/to/file1
├──/path/to/file2
└──/path/to/file3
```

### Remove Command

Remove Flag from files.

```shell
# input (Remove Flag from files under src)
npx flagfrog remove './src/**/*.{ts,tsx}'
```

Remove the flag from the implementation as shown below.
Please execute this when branching by flag is no longer necessary.

```javascript
// before
import { flagHandler } from "flagfrog";

FlagHandler({
  name: "FlagName",
  value: true,
  on: () => {
    console.log("ON");
  },
  off: () => {
    console.log("OFF");
  },
});
```

```javascript
// after
console.log("ON");
```

## API

FlagFrog provides a simple API for feature flag;

- [flagHandler](#flaghandler)
- [flagSwithcher](#flagswitcher)
- [FlagReader](#flagreader)

### flagHandler

Branch processing depending on whether the flag is ON or OFF.

| Argument | Type      | Description                      |
| -------- | --------- | -------------------------------- |
| `name`   | `string`  | Flag naming, used in the CLI     |
| `value`  | `boolean` | Whether flag is on or off        |
| `on`     | `() => T` | Dispatches when the value is ON  |
| `off`    | `() => U` | Dispatches when the value is OFF |

The following is a sample code.

```javascript
import { flagHandler } from "flagfrog";

flagHandler({
  name: "FlagName",
  value: true,
  on: () => {
    // Dispatches when the flag is ON
    console.log("ON");
  },
  off: () => {
    // Dispatches when the flag is OFF
    console.log("OFF");
  },
});
```

When you run the remove command, it will be converted to the following:

```javascript
console.log("ON");
```

### flagSwitcher

Branch the value returned depending on whether the flag is ON or OFF.

| Argument | Type      | Description                  |
| -------- | --------- | ---------------------------- |
| `name`   | `string`  | Flag naming, used in the CLI |
| `value`  | `boolean` | Whether flag is on or off    |
| `on`     | `T`       | Return when the value is ON  |
| `off`    | `U`       | Return when the value is OFF |

The following is a sample code.

```javascript
import { flagSwitcher } from "flagfrog";

const result = flagSwitcher({
  name: "FlagName",
  value: true,
  on: "ON Text!!"
  off: "OFF Text!!"
});
```

When you run the remove command, it will be converted to the following:

```javascript
const result = "ON Text!!";
```

### FlagRenderer

Branch the component to be displayed depending on the ON/OFF of the flag

| Props   | Type        | Description                  |
| ------- | ----------- | ---------------------------- |
| `name`  | `string`    | Flag naming, used in the CLI |
| `value` | `boolean`   | Whether flag is on or off    |
| `on`    | `ReactNode` | Render when the value is ON  |
| `off`   | `ReactNode` | Render when the value is OFF |

The following is a sample code.

```jsx
import { flagHandler } from "flagfrog";

const Component = () => {
  return (
    <FlagRenderer
      name="FlagName"
      value={true}
      on={<p>ON Text!!</p>}
      off={<p>OFF Text!!</p>}
    />
  );
};
```

When you run the remove command, it will be converted to the following:

```jsx
const Component = () => {
  return <p>ON Text!!</p>;
};
```
