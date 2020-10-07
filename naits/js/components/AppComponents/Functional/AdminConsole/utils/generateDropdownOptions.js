import React from 'react'

export function generateUserGroupsDropdown (userGroups, defaultSelection) {
  const selector = 'SVAROG_USER_GROUPS.GROUP_NAME'
  let options = []
  if (userGroups && userGroups.constructor === Array && userGroups.length > 0) {
    for (let i = 0; i < userGroups.length; i++) {
      const item = userGroups[i][selector]
      options.push(
        <option id={item} key={item} value={item}
          {...defaultSelection === item && { selected: 'selected' }}
        >
          {item}
        </option>
      )
    }
  }
  return options
}
