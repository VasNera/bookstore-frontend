interface FormFieldProps {
    id: string
    label: string
    type?: string
    value: string
    onChange: (value: string) => void
    error?: string
}

export function FormField({id, label, type = 'text', value, onChange,error}: FormFieldProps) {
    return (
    <div>
      <label htmlFor={id} className="mb-1 block text-brown">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-brown/30 bg-white px-3 py-2"
      />
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}